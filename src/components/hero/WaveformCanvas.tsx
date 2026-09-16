import React, { useEffect, useRef } from 'react';

interface WaveformCanvasProps {
  width?: number;
  height?: number;
  color?: string;
  type?: 'ecg' | 'pleth';
  bpm?: number;
  className?: string;
}

export const WaveformCanvas: React.FC<WaveformCanvasProps> = ({
  width = 240,
  height = 48,
  color = '#19C7F3',
  type = 'ecg',
  bpm = 72,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina display scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let animationFrameId: number;
    let sweepX = 0;
    const speed = 1.4; // pixels per frame

    // Pre-calculate waveform cycle function (normalized 0 to 1)
    const getECGValue = (phase: number): number => {
      // phase is between 0 and 1
      if (phase < 0.12) return 0; // baseline
      if (phase < 0.22) {
        // P-wave
        const pPhase = (phase - 0.12) / 0.1;
        return Math.sin(pPhase * Math.PI) * 0.18;
      }
      if (phase < 0.32) return 0; // PR segment
      if (phase < 0.35) {
        // Q-wave
        const qPhase = (phase - 0.32) / 0.03;
        return -Math.sin(qPhase * Math.PI) * 0.16;
      }
      if (phase < 0.40) {
        // R-wave sharp peak
        const rPhase = (phase - 0.35) / 0.05;
        return Math.sin(rPhase * Math.PI) * 0.95;
      }
      if (phase < 0.44) {
        // S-wave negative dip
        const sPhase = (phase - 0.40) / 0.04;
        return -Math.sin(sPhase * Math.PI) * 0.28;
      }
      if (phase < 0.52) return 0; // ST segment
      if (phase < 0.72) {
        // T-wave
        const tPhase = (phase - 0.52) / 0.2;
        return Math.sin(tPhase * Math.PI) * 0.32;
      }
      return 0; // TP baseline
    };

    const getPlethValue = (phase: number): number => {
      // Pulsatile arterial SpO2 wave: rapid systolic rise, dicrotic notch, diastolic decay
      if (phase < 0.25) {
        // Systolic rise
        return Math.sin((phase / 0.25) * (Math.PI / 2)) * 0.85;
      } else if (phase < 0.4) {
        // Dicrotic notch
        const dPhase = (phase - 0.25) / 0.15;
        return 0.85 - dPhase * 0.35 + Math.sin(dPhase * Math.PI) * 0.08;
      } else {
        // Diastolic runoff
        const rPhase = (phase - 0.4) / 0.6;
        return (0.5 + Math.cos(rPhase * Math.PI) * 0.15) * Math.exp(-rPhase * 2);
      }
    };

    const midY = height * 0.52;
    const amplitude = height * 0.38;
    const wavelength = (60 / bpm) * 60 * speed; // pixels per heartbeat

    // Buffer to store recent history for smooth rendering
    const history: { x: number; y: number }[] = [];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle phosphor grid background
      ctx.strokeStyle = 'rgba(25, 199, 243, 0.05)';
      ctx.lineWidth = 1;
      const gridStep = 16;
      for (let x = 0; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Increment sweep
      sweepX = (sweepX + speed) % width;

      // Calculate current value
      const phase = (sweepX % wavelength) / wavelength;
      const rawVal = type === 'ecg' ? getECGValue(phase) : getPlethValue(phase);
      const currentY = midY - rawVal * amplitude;

      // Update history buffer
      history.push({ x: sweepX, y: currentY });
      if (history.length > width / speed) {
        history.shift();
      }

      // Draw trace with phosphor persistence
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // 1. Draw glowing background path
      ctx.shadowBlur = 8;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;

      ctx.beginPath();
      let started = false;
      for (let i = 0; i < history.length; i++) {
        const pt = history[i];
        // Erase zone just ahead of sweep point (like real medical monitor beam)
        const distBehind = (sweepX - pt.x + width) % width;
        if (distBehind > 6) {
          if (!started) {
            ctx.moveTo(pt.x, pt.y);
            started = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();

      // Reset shadow for crisp leading point
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ffffff';
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sweepX, currentY, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Clear the erase zone (20px ahead of the sweep head)
      const eraseWidth = 24;
      const gradient = ctx.createLinearGradient(sweepX, 0, sweepX + eraseWidth, 0);
      gradient.addColorStop(0, 'rgba(11, 18, 32, 0.95)');
      gradient.addColorStop(1, 'rgba(11, 18, 32, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(sweepX, 0, Math.min(eraseWidth, width - sweepX), height);
      if (sweepX + eraseWidth > width) {
        ctx.fillRect(0, 0, (sweepX + eraseWidth) % width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [width, height, color, type, bpm]);

  return (
    <div className={`relative overflow-hidden rounded-lg bg-[#070D18]/90 border border-cyan-500/20 ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="block"
      />
    </div>
  );
};
