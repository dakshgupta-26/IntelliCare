import { create } from 'zustand';
import { ForecastHorizon, ForecastModelType, DepartmentForecastSeries } from '../types/forecasting';
import { FORECAST_DATA } from '../data/mockDatabase';

interface ForecastState {
  forecastData: DepartmentForecastSeries;
  selectedHorizon: ForecastHorizon;
  selectedModel: ForecastModelType;
  selectedDepartmentId: string;
  showConfidenceBands: boolean;
  showSurgeAnomaly: boolean;
  isGeneratingForecast: boolean;
  
  // Actions
  setHorizon: (horizon: ForecastHorizon) => void;
  setModel: (model: ForecastModelType) => void;
  setDepartmentId: (deptId: string) => void;
  setShowConfidenceBands: (show: boolean) => void;
  setShowSurgeAnomaly: (show: boolean) => void;
  triggerForecastRefresh: () => Promise<void>;
}

export const useForecastStore = create<ForecastState>((set) => ({
  forecastData: FORECAST_DATA,
  selectedHorizon: '24H',
  selectedModel: 'LSTM',
  selectedDepartmentId: 'dept-er',
  showConfidenceBands: true,
  showSurgeAnomaly: false,
  isGeneratingForecast: false,

  setHorizon: (horizon) => set({ selectedHorizon: horizon }),
  setModel: (model) => set({ selectedModel: model }),
  setDepartmentId: (deptId) => set({ selectedDepartmentId: deptId }),
  setShowConfidenceBands: (show) => set({ showConfidenceBands: show }),
  setShowSurgeAnomaly: (show) => set({ showSurgeAnomaly: show }),

  triggerForecastRefresh: async () => {
    set({ isGeneratingForecast: true });
    // Simulate multi-horizon neural tensor forward pass
    await new Promise((resolve) => setTimeout(resolve, 850));
    set({ isGeneratingForecast: false });
  }
}));
