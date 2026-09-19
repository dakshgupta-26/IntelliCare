export type SettingsSectionId =
  | 'overview'
  | 'profile'
  | 'organization'
  | 'departments'
  | 'users'
  | 'security'
  | 'thresholds'
  | 'notifications'
  | 'operations'
  | 'forecasting'
  | 'optimization'
  | 'ai'
  | 'integrations'
  | 'data-privacy'
  | 'audit'
  | 'appearance'
  | 'danger-zone';

export interface SettingsCategory {
  id: string;
  label: string;
  items: {
    id: SettingsSectionId;
    label: string;
    description: string;
    iconName: string;
    badge?: string;
    badgeVariant?: 'default' | 'cyan' | 'amber' | 'rose' | 'emerald';
  }[];
}

export interface SettingsDirtyState {
  hasChanges: boolean;
  sectionsModified: SettingsSectionId[];
}
