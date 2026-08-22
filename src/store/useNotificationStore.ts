import { create } from 'zustand';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'forecast' | 'optimization' | 'recommendation' | 'alert' | 'system';
  targetUrl?: string;
}

interface NotificationState {
  notifications: AppNotification[];
  isDrawerOpen: boolean;
  
  // Actions
  setDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  getUnreadCount: () => number;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-01',
    title: 'Optimal Allocation Plan Available',
    message: 'OR-Tools completed global optimization for Emergency & ICU departments in 84ms.',
    timestamp: '2 mins ago',
    read: false,
    type: 'optimization',
    targetUrl: '/app/optimization'
  },
  {
    id: 'notif-02',
    title: 'Surge Warning: Emergency Department',
    message: 'LSTM forecast detects 146 pts/hr triage peak between 18:00 and 22:00.',
    timestamp: '14 mins ago',
    read: false,
    type: 'forecast',
    targetUrl: '/app/forecasting'
  },
  {
    id: 'notif-03',
    title: 'Recommendation Pending Human Review',
    message: 'Transfer 4 floater nurses to ED triage before shift transition.',
    timestamp: '25 mins ago',
    read: false,
    type: 'recommendation',
    targetUrl: '/app/recommendations'
  }
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: INITIAL_NOTIFICATIONS,
  isDrawerOpen: false,

  setDrawerOpen: (open) => set({ isDrawerOpen: open }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true }))
    }));
  },

  addNotification: (item) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
      ...item
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications]
    }));
  },

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  }
}));
