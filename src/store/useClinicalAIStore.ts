import { create } from 'zustand';
import {
  PatientVitals,
  PatientPreset,
  MultiModelRiskAssessment,
  DrugItem,
  DrugInteractionResult,
  RiskTier
} from '../types/clinicalAi';

const PATIENT_PRESETS: PatientPreset[] = [
  {
    id: 'preset-septic',
    name: 'Septic Shock Alert — Bed ICU-04',
    bedCode: 'ICU-04',
    department: 'Intensive Care Unit',
    admissionReason: 'Severe Community-Acquired Pneumonia with Secondary Sepsis',
    clinicalNote: 'Patient presenting with refractory hypotension, elevated lactate, and marked leukocytosis. High risk of multiorgan failure.',
    vitals: {
      heartRate: 132,
      systolicBp: 82,
      diastolicBp: 48,
      meanArterialPressure: 59,
      respiratoryRate: 34,
      spo2Oxygen: 88,
      temperatureCelsius: 39.4,
      serumLactate: 4.8,
      wbcCount: 24.2,
      glasgowComaScale: 12,
      age: 68,
      supplementalOxygen: true
    }
  },
  {
    id: 'preset-cardiac',
    name: 'Post-CABG Cardiac Decompensation — Bed CICU-02',
    bedCode: 'CICU-02',
    department: 'Cardiothoracic ICU',
    admissionReason: 'Day 2 Post-Coronary Artery Bypass Graft (CABG x 3)',
    clinicalNote: 'New-onset atrial fibrillation with rapid ventricular response, narrow pulse pressure, and declining oxygenation.',
    vitals: {
      heartRate: 148,
      systolicBp: 94,
      diastolicBp: 62,
      meanArterialPressure: 72,
      respiratoryRate: 26,
      spo2Oxygen: 91,
      temperatureCelsius: 37.8,
      serumLactate: 2.9,
      wbcCount: 14.5,
      glasgowComaScale: 14,
      age: 72,
      supplementalOxygen: true
    }
  },
  {
    id: 'preset-resp',
    name: 'Acute Respiratory Distress — Bed ED-TRAUMA-01',
    bedCode: 'ED-01',
    department: 'Emergency & Trauma',
    admissionReason: 'COPD Exacerbation with Hypoxemic Respiratory Failure',
    clinicalNote: 'Severe dyspnea, accessory muscle use, and hypercapnic drive failure. BiPAP initiated.',
    vitals: {
      heartRate: 118,
      systolicBp: 155,
      diastolicBp: 92,
      meanArterialPressure: 113,
      respiratoryRate: 38,
      spo2Oxygen: 84,
      temperatureCelsius: 37.2,
      serumLactate: 2.1,
      wbcCount: 16.8,
      glasgowComaScale: 13,
      age: 64,
      supplementalOxygen: true
    }
  },
  {
    id: 'preset-stable',
    name: 'Stable Post-Op Inpatient — Ward 3 Bed 14',
    bedCode: 'GW3-14',
    department: 'General Surgical Ward',
    admissionReason: 'Day 3 Laparoscopic Hemicolectomy',
    clinicalNote: 'Normotensive, ambulating well, afebrile with normal inflammatory markers.',
    vitals: {
      heartRate: 72,
      systolicBp: 122,
      diastolicBp: 78,
      meanArterialPressure: 92,
      respiratoryRate: 16,
      spo2Oxygen: 98,
      temperatureCelsius: 36.8,
      serumLactate: 0.9,
      wbcCount: 7.2,
      glasgowComaScale: 15,
      age: 54,
      supplementalOxygen: false
    }
  }
];

const AVAILABLE_DRUGS: DrugItem[] = [
  { id: 'warfarin', brandName: 'Coumadin', genericName: 'Warfarin Sodium', category: 'Anticoagulant (VKA)', route: 'Oral', cypPathways: ['CYP2C9', 'CYP3A4', 'CYP1A2'] },
  { id: 'amiodarone', brandName: 'Cordarone', genericName: 'Amiodarone HCl', category: 'Class III Antiarrhythmic', route: 'Oral/IV', cypPathways: ['CYP3A4', 'CYP2C9', 'P-gp Inhibitor'] },
  { id: 'clopidogrel', brandName: 'Plavix', genericName: 'Clopidogrel', category: 'P2Y12 Antiplatelet', route: 'Oral', cypPathways: ['CYP2C19', 'CYP3A4'] },
  { id: 'omeprazole', brandName: 'Prilosec', genericName: 'Omeprazole', category: 'Proton Pump Inhibitor', route: 'Oral/IV', cypPathways: ['CYP2C19 Inhibitor'] },
  { id: 'digoxin', brandName: 'Lanoxin', genericName: 'Digoxin', category: 'Cardiac Glycoside', route: 'Oral/IV', cypPathways: ['P-gp Substrate', 'Renal Clear'] },
  { id: 'metoprolol', brandName: 'Lopressor', genericName: 'Metoprolol Tartrate', category: 'Beta-1 Blocker', route: 'Oral/IV', cypPathways: ['CYP2D6'] },
  { id: 'ciprofloxacin', brandName: 'Cipro', genericName: 'Ciprofloxacin', category: 'Fluoroquinolone Antibiotic', route: 'Oral/IV', cypPathways: ['CYP1A2 Inhibitor', 'QT Prolonging'] },
  { id: 'vancomycin', brandName: 'Vancocin', genericName: 'Vancomycin HCl', category: 'Glycopeptide Antibiotic', route: 'IV Infusion', cypPathways: ['Nephrotoxic Load', 'Renal Clear'] },
  { id: 'tramadol', brandName: 'Ultram', genericName: 'Tramadol HCl', category: 'Opioid / SNRI Agonist', route: 'Oral', cypPathways: ['CYP2D6', 'CYP3A4', 'Serotonergic'] },
  { id: 'sertraline', brandName: 'Zoloft', genericName: 'Sertraline HCl', category: 'SSRI Antidepressant', route: 'Oral', cypPathways: ['CYP2D6', 'CYP2C19', 'Serotonergic'] },
  { id: 'heparin', brandName: 'Heparin Sodium', genericName: 'Unfractionated Heparin', category: 'Parenteral Anticoagulant', route: 'IV Continuous', cypPathways: ['Antithrombin III'] },
  { id: 'metformin', brandName: 'Glucophage', genericName: 'Metformin HCl', category: 'Biguanide Antidiabetic', route: 'Oral', cypPathways: ['OCT2/MATE', 'Lactate Risk'] }
];

const calculateRiskAssessment = (v: PatientVitals): MultiModelRiskAssessment => {
  // Random Forest Sepsis Score calculation (simulated tree splits on Lactate, WBC, HR, BP)
  let rfScore = 15;
  if (v.serumLactate > 2.0) rfScore += 25;
  if (v.serumLactate > 4.0) rfScore += 30;
  if (v.wbcCount > 12.0 || v.wbcCount < 4.0) rfScore += 15;
  if (v.heartRate > 100) rfScore += 12;
  if (v.temperatureCelsius > 38.3 || v.temperatureCelsius < 36.0) rfScore += 10;
  if (v.meanArterialPressure < 65) rfScore += 18;
  rfScore = Math.min(99, Math.max(5, rfScore));

  // XGBoost ICU Deterioration Risk (gradient boosting on non-linear interaction)
  let xgbScore = 12;
  if (v.spo2Oxygen < 92) xgbScore += (92 - v.spo2Oxygen) * 4.5;
  if (v.respiratoryRate > 22) xgbScore += (v.respiratoryRate - 22) * 2.8;
  if (v.systolicBp < 90) xgbScore += 26;
  if (v.glasgowComaScale < 14) xgbScore += (15 - v.glasgowComaScale) * 6.5;
  if (v.age > 65) xgbScore += 10;
  if (v.supplementalOxygen) xgbScore += 8;
  xgbScore = Math.min(99, Math.max(4, Math.round(xgbScore)));

  // LSTM Cardiac/Hemodynamic Collapse 12H Risk
  let lstmScore = Math.round(rfScore * 0.45 + xgbScore * 0.55 + (v.heartRate > 120 ? 12 : 0));
  lstmScore = Math.min(99, Math.max(5, lstmScore));

  // Ensemble Average
  const ensembleScore = Math.round((rfScore * 0.35 + xgbScore * 0.4 + lstmScore * 0.25));

  // NEWS2 Standardized Score calculation
  let news2 = 0;
  if (v.respiratoryRate <= 8 || v.respiratoryRate >= 25) news2 += 3;
  else if (v.respiratoryRate >= 21) news2 += 2;
  else if (v.respiratoryRate >= 9 && v.respiratoryRate <= 11) news2 += 1;

  if (v.spo2Oxygen <= 91) news2 += 3;
  else if (v.spo2Oxygen <= 93) news2 += 2;
  else if (v.spo2Oxygen <= 95) news2 += 1;

  if (v.supplementalOxygen) news2 += 2;

  if (v.systolicBp <= 90 || v.systolicBp >= 220) news2 += 3;
  else if (v.systolicBp <= 100) news2 += 2;
  else if (v.systolicBp <= 110) news2 += 1;

  if (v.heartRate <= 40 || v.heartRate >= 131) news2 += 3;
  else if (v.heartRate >= 111 || v.heartRate <= 50) news2 += 2;
  else if (v.heartRate >= 91) news2 += 1;

  if (v.glasgowComaScale < 15) news2 += 3;

  if (v.temperatureCelsius <= 35.0) news2 += 3;
  else if (v.temperatureCelsius >= 39.1) news2 += 2;
  else if (v.temperatureCelsius <= 36.0 || v.temperatureCelsius >= 38.1) news2 += 1;

  // SOFA (Sequential Organ Failure Assessment) Score estimate
  let sofa = 0;
  if (v.spo2Oxygen < 88) sofa += 3;
  else if (v.spo2Oxygen < 92) sofa += 2;
  else if (v.spo2Oxygen < 96) sofa += 1;

  if (v.meanArterialPressure < 65) sofa += 2;
  if (v.serumLactate > 4.0) sofa += 3;
  else if (v.serumLactate > 2.0) sofa += 1;
  if (v.glasgowComaScale < 10) sofa += 3;
  else if (v.glasgowComaScale < 13) sofa += 2;
  else if (v.glasgowComaScale < 15) sofa += 1;

  let riskTier: RiskTier = 'LOW';
  if (ensembleScore >= 75 || news2 >= 7) riskTier = 'CRITICAL_ALERT';
  else if (ensembleScore >= 50 || news2 >= 5) riskTier = 'HIGH';
  else if (ensembleScore >= 25 || news2 >= 3) riskTier = 'MODERATE';

  // 12-Hour LSTM Recurrent Projection
  const trajectory = Array.from({ length: 7 }).map((_, i) => {
    const hourOffset = i * 2;
    const hourLabel = hourOffset === 0 ? 'T+0h (Now)' : `T+${hourOffset}h`;
    const drift = riskTier === 'CRITICAL_ALERT' ? 1.08 : riskTier === 'HIGH' ? 1.04 : 0.96;
    const projected = Math.min(99, Math.max(5, Math.round(ensembleScore * Math.pow(drift, i * 0.4))));
    return {
      hourOffset,
      hourLabel,
      projectedRiskScore: projected,
      ciLower: Math.max(3, projected - 8),
      ciUpper: Math.min(100, projected + 9)
    };
  });

  // Drivers
  const drivers: MultiModelRiskAssessment['primaryDeteriorationDrivers'] = [];
  if (v.serumLactate > 2.0) {
    drivers.push({ factor: `Elevated Serum Lactate (${v.serumLactate} mmol/L)`, contribution: 32, status: v.serumLactate > 4.0 ? 'ALARM' : 'WARNING' });
  }
  if (v.meanArterialPressure < 65) {
    drivers.push({ factor: `Refractory Hypotension (MAP ${v.meanArterialPressure} mmHg)`, contribution: 26, status: 'ALARM' });
  }
  if (v.spo2Oxygen < 92) {
    drivers.push({ factor: `Hypoxemic Desaturation (${v.spo2Oxygen}%)`, contribution: 22, status: v.spo2Oxygen < 88 ? 'ALARM' : 'WARNING' });
  }
  if (v.heartRate > 110) {
    drivers.push({ factor: `Severe Tachycardia (${v.heartRate} BPM)`, contribution: 18, status: 'WARNING' });
  }
  if (v.wbcCount > 14.0) {
    drivers.push({ factor: `Systemic Leukocytosis (${v.wbcCount} x10^9/L)`, contribution: 14, status: 'WARNING' });
  }
  if (drivers.length === 0) {
    drivers.push({ factor: 'Hemodynamics and Biomarkers within Normal Physiological Range', contribution: 5, status: 'NORMAL' });
  }

  // Clinical Directives
  const directives: MultiModelRiskAssessment['clinicalDirectives'] = [];
  if (riskTier === 'CRITICAL_ALERT') {
    directives.push({
      id: 'dir-1',
      priority: 'EMERGENT',
      action: 'Initiate Surviving Sepsis 1-Hour Bundle: 30 mL/kg IV balanced crystalloid + broad spectrum coverage.',
      targetWindow: 'Within 30 min',
      guidelineRef: 'SSC 2024 / ICU SOP-04'
    });
    directives.push({
      id: 'dir-2',
      priority: 'EMERGENT',
      action: 'Place continuous arterial line monitoring and notify On-Duty Intensivist for emergent ICU bed transfer.',
      targetWindow: 'Immediate',
      guidelineRef: 'Rapid Response Level-1'
    });
  } else if (riskTier === 'HIGH') {
    directives.push({
      id: 'dir-3',
      priority: 'URGENT',
      action: 'Increase vital monitoring frequency to q15min. Order repeat serum lactate and blood gas panel (ABG).',
      targetWindow: 'Within 1 hour',
      guidelineRef: 'MEWS Clinical Policy'
    });
  } else {
    directives.push({
      id: 'dir-4',
      priority: 'ROUTINE',
      action: 'Continue standard floor monitoring q4h. Maintain scheduled maintenance IV fluids and oral intake.',
      targetWindow: 'Next Shift',
      guidelineRef: 'Inpatient SOP'
    });
  }

  return {
    randomForestSepsisRisk: rfScore,
    xgboostIcuDeteriorationRisk: xgbScore,
    lstmCardiacArrestRisk: lstmScore,
    ensembleOverallRisk: ensembleScore,
    riskTier,
    news2Score: news2,
    sofaScore: sofa,
    riskTrajectoryNext12Hours: trajectory,
    primaryDeteriorationDrivers: drivers,
    clinicalDirectives: directives
  };
};

const calculateDrugInteractions = (drugIds: string[]): DrugInteractionResult[] => {
  const results: DrugInteractionResult[] = [];

  const has = (id: string) => drugIds.includes(id);

  if (has('warfarin') && has('amiodarone')) {
    results.push({
      pair: ['warfarin', 'amiodarone'],
      drugA: 'Warfarin Sodium',
      drugB: 'Amiodarone HCl',
      severity: 'MAJOR',
      interactionMechanism: 'Amiodarone strongly inhibits CYP2C9 and CYP3A4, markedly decreasing the clearance of Warfarin.',
      clinicalImpact: 'Profound elevation of INR with extreme risk of fatal internal hemorrhage / GI bleeding.',
      mlConfidence: 98.4,
      actionRecommendation: 'Empirically decrease Warfarin maintenance dose by 33% to 50%. Check INR daily until therapeutic stabilization.'
    });
  }

  if (has('clopidogrel') && has('omeprazole')) {
    results.push({
      pair: ['clopidogrel', 'omeprazole'],
      drugA: 'Clopidogrel',
      drugB: 'Omeprazole',
      severity: 'MAJOR',
      interactionMechanism: 'Omeprazole competitively inhibits CYP2C19, preventing the bioactivation of prodrug Clopidogrel.',
      clinicalImpact: 'Sub-therapeutic antiplatelet efficacy, resulting in elevated risk of stent thrombosis and ischemic stroke.',
      mlConfidence: 96.1,
      actionRecommendation: 'Switch proton pump inhibitor from Omeprazole to Pantoprazole (minimal CYP2C19 inhibition) or Famotidine (H2 blocker).'
    });
  }

  if (has('amiodarone') && has('ciprofloxacin')) {
    results.push({
      pair: ['amiodarone', 'ciprofloxacin'],
      drugA: 'Amiodarone HCl',
      drugB: 'Ciprofloxacin',
      severity: 'CONTRAINDICATED',
      interactionMechanism: 'Additive cardiac potassium channel (hERG/IKr) blockade leading to severe QTc interval prolongation.',
      clinicalImpact: 'High risk of fatal Torsades de Pointes, polymorphic ventricular tachycardia, and cardiac arrest.',
      mlConfidence: 99.2,
      actionRecommendation: 'CONTRAINDICATED. Avoid co-administration. Select alternative antibiotic without QT risk (e.g., Ceftriaxone or Meropenem).'
    });
  }

  if (has('warfarin') && has('heparin')) {
    results.push({
      pair: ['warfarin', 'heparin'],
      drugA: 'Warfarin Sodium',
      drugB: 'Heparin Sodium',
      severity: 'MODERATE',
      interactionMechanism: 'Dual anticoagulation pathway synergy (Vitamin K antagonism + Factor Xa/IIa inhibition).',
      clinicalImpact: 'Increased bleeding risk during bridge therapy.',
      mlConfidence: 92.5,
      actionRecommendation: 'Standard therapeutic bridging protocol: Maintain simultaneous therapy only until INR >= 2.0 for 2 consecutive days, then discontinue Heparin.'
    });
  }

  if (has('digoxin') && has('amiodarone')) {
    results.push({
      pair: ['digoxin', 'amiodarone'],
      drugA: 'Digoxin',
      drugB: 'Amiodarone HCl',
      severity: 'MAJOR',
      interactionMechanism: 'Amiodarone inhibits P-glycoprotein renal and biliary transport of Digoxin, doubling serum digoxin levels.',
      clinicalImpact: 'Digoxin toxicity (bradycardia, yellow vision, ventricular arrhythmias, AV block).',
      mlConfidence: 97.0,
      actionRecommendation: 'Reduce Digoxin dose by 50% immediately upon initiating Amiodarone. Monitor serum Digoxin troughs.'
    });
  }

  if (has('tramadol') && has('sertraline')) {
    results.push({
      pair: ['tramadol', 'sertraline'],
      drugA: 'Tramadol HCl',
      drugB: 'Sertraline HCl',
      severity: 'MAJOR',
      interactionMechanism: 'Additive serotonergic neurotransmission enhancement and CYP2D6 metabolic competition.',
      clinicalImpact: 'High risk of Serotonin Syndrome (hyperthermia, clonus, autonomic instability, agitation) and lowered seizure threshold.',
      mlConfidence: 94.8,
      actionRecommendation: 'Avoid combination. Use non-serotonergic analgesic (e.g. Acetaminophen, IV Ibuprofen, or low-dose Morphine).'
    });
  }

  if (has('vancomycin') && has('ciprofloxacin')) {
    results.push({
      pair: ['vancomycin', 'ciprofloxacin'],
      drugA: 'Vancomycin HCl',
      drugB: 'Ciprofloxacin',
      severity: 'MODERATE',
      interactionMechanism: 'Synergistic tubular epithelial cell oxidative stress in renal proximal tubules.',
      clinicalImpact: 'Increased risk of Acute Kidney Injury (AKI) and reduced glomerular filtration.',
      mlConfidence: 89.2,
      actionRecommendation: 'Monitor daily Serum Creatinine and eGFR. Maintain strict therapeutic Vancomycin AUC/MIC or trough targets (15-20 mcg/mL).'
    });
  }

  return results;
};

interface ClinicalAIState {
  patientVitals: PatientVitals;
  activePresetId: string | null;
  presets: PatientPreset[];
  riskAssessment: MultiModelRiskAssessment;
  
  // Drug matrix
  selectedDrugIds: string[];
  availableDrugs: DrugItem[];
  drugInteractions: DrugInteractionResult[];

  // Actions
  updateVital: (vital: keyof PatientVitals, value: number | boolean) => void;
  loadPreset: (presetId: string) => void;
  toggleDrug: (drugId: string) => void;
  clearDrugs: () => void;
}

export const useClinicalAIStore = create<ClinicalAIState>((set, get) => {
  const initialPreset = PATIENT_PRESETS[0];
  const initialAssessment = calculateRiskAssessment(initialPreset.vitals);
  const initialDrugs = ['warfarin', 'amiodarone', 'clopidogrel'];

  return {
    patientVitals: initialPreset.vitals,
    activePresetId: initialPreset.id,
    presets: PATIENT_PRESETS,
    riskAssessment: initialAssessment,

    selectedDrugIds: initialDrugs,
    availableDrugs: AVAILABLE_DRUGS,
    drugInteractions: calculateDrugInteractions(initialDrugs),

    updateVital: (vital, value) => {
      const newVitals = {
        ...get().patientVitals,
        [vital]: value
      };
      // Recalculate MAP if SBP/DBP changed
      if (vital === 'systolicBp' || vital === 'diastolicBp') {
        const sbp = vital === 'systolicBp' ? (value as number) : newVitals.systolicBp;
        const dbp = vital === 'diastolicBp' ? (value as number) : newVitals.diastolicBp;
        newVitals.meanArterialPressure = Math.round((sbp + 2 * dbp) / 3);
      }

      const newAssessment = calculateRiskAssessment(newVitals);
      set({
        patientVitals: newVitals,
        activePresetId: null, // Custom vitals
        riskAssessment: newAssessment
      });
    },

    loadPreset: (presetId) => {
      const preset = get().presets.find((p) => p.id === presetId);
      if (!preset) return;
      const newAssessment = calculateRiskAssessment(preset.vitals);
      set({
        patientVitals: { ...preset.vitals },
        activePresetId: preset.id,
        riskAssessment: newAssessment
      });
    },

    toggleDrug: (drugId) => {
      const current = get().selectedDrugIds;
      const next = current.includes(drugId) ? current.filter((id) => id !== drugId) : [...current, drugId];
      const interactions = calculateDrugInteractions(next);
      set({
        selectedDrugIds: next,
        drugInteractions: interactions
      });
    },

    clearDrugs: () => {
      set({
        selectedDrugIds: [],
        drugInteractions: []
      });
    }
  };
});
