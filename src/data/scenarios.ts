import { ScenarioPreset } from '../types/simulation';

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'sc-mass-casualty',
    name: 'Regional Highway Incident (MCI)',
    category: 'Mass Casualty',
    description: 'Sudden high-velocity influx of multi-trauma presentations requiring immediate resuscitation bays, emergency surgery, and critical care step-ins.',
    parameters: {
      emergencyDemandChangePercent: 45,
      icuBedChange: -4,
      nurseAvailabilityChangePercent: 0
    },
    projectedImpact: {
      icuLoadDelta: '+28% (Projected at 98.4%)',
      staffShortfall: '6 Critical Care Nurses / 3 Trauma Surgeons',
      waitTimeChange: '+64 minutes for Non-Urgent ED',
      riskLevel: 'CRITICAL',
      automatedMitigation: 'Trigger Code Orange; hold elective surgical admissions; mobilize on-call trauma teams A & B; convert Recovery Bay 2 into ventilated surge beds.'
    }
  },
  {
    id: 'sc-epidemic-wave',
    name: 'Winter Viral Respiratory Surge (Influenza/RSV)',
    category: 'Epidemic Surge',
    description: 'Sustained 72-hour increase in high-dependency respiratory admissions with concurrent staff sick leave and isolation requirements.',
    parameters: {
      emergencyDemandChangePercent: 25,
      icuBedChange: -2,
      nurseAvailabilityChangePercent: -15
    },
    projectedImpact: {
      icuLoadDelta: '+16% (Projected at 94.0%)',
      staffShortfall: '12 Registered Nurses across Shifts A & B',
      waitTimeChange: '+38 minutes for Triage Level 3',
      riskLevel: 'HIGH',
      automatedMitigation: 'Expand Step-Down Ward telemetry by 12 beds; authorize overtime floater rates; activate rapid discharge checklist for stable medical inpatients.'
    }
  },
  {
    id: 'sc-icu-maintenance',
    name: 'HVAC Filtration Maintenance (ICU Pod Closure)',
    category: 'Severe Weather',
    description: 'Scheduled physical closure of 6 ICU isolation beds for mandatory negative-pressure ventilation filter replacement over 24 hours.',
    parameters: {
      emergencyDemandChangePercent: 5,
      icuBedChange: -6,
      nurseAvailabilityChangePercent: 0
    },
    projectedImpact: {
      icuLoadDelta: '+22% on Remaining Pods (Projected at 96.2%)',
      staffShortfall: 'Balanced (Staff reallocated to PACU)',
      waitTimeChange: '+15 minutes for Post-Op Transfer',
      riskLevel: 'MODERATE',
      automatedMitigation: 'Repurpose PACU Bay 4-6 as overnight ventilated overflow; reschedule 4 low-acuity elective surgeries requiring guaranteed ICU reserve.'
    }
  },
  {
    id: 'sc-staff-absenteeism',
    name: 'Severe Blizzard / Transit Stoppage',
    category: 'Staff Shortage',
    description: 'Severe weather causing 20% staff commuting disruption during an elevated pediatric and hypothermia presentation baseline.',
    parameters: {
      emergencyDemandChangePercent: 10,
      icuBedChange: 0,
      nurseAvailabilityChangePercent: -20
    },
    projectedImpact: {
      icuLoadDelta: '+8% (Projected at 88.5%)',
      staffShortfall: '18 Nurses across General Wards and ED',
      waitTimeChange: '+45 minutes for General Admissions',
      riskLevel: 'HIGH',
      automatedMitigation: 'Implement 12-hour consolidated shift pattern; deploy on-site resting quarters; prioritize acute ED and ICU nurse staffing over outpatient clinics.'
    }
  }
];
