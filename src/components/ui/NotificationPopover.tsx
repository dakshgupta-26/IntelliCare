import React from 'react';
import { Bell, ExternalLink, X, TrendingUp, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNotificationStore, AppNotification } from '../../store/useNotificationStore';
import { useRouterStore } from '../../store/useRouterStore';

export const NotificationPopover: React.FC = () => {
  const isDrawerOpen = useNotificationStore((state) => state.isDrawerOpen);
  const setDrawerOpen = useNotificationStore((state) => state.setDrawerOpen);
  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const navigate = useRouterStore((state) => state.navigate);

  if (!isDrawerOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'forecast':
        return <TrendingUp className="w-4 h-4 text-teal-400" />;
      case 'optimization':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'recommendation':
        return <CheckCircle2 className="w-4 h-4 text-amber-400" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleClickItem = (notif: AppNotification) => {
    markAsRead(notif.id);
    if (notif.targetUrl) {
      setDrawerOpen(false);
      navigate(notif.targetUrl);
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-up">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 bg-surface-200/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-display font-bold text-white">Notifications</h3>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
            {notifications.filter((n) => !n.read).length} Unread
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            Mark all read
          </button>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-surface-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No active notifications
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleClickItem(notif)}
              className={`p-3.5 flex items-start gap-3 hover:bg-surface-200/50 transition-colors cursor-pointer ${
                !notif.read ? 'bg-cyan-500/5' : ''
              }`}
            >
              <div className="p-2 rounded-lg bg-surface-200 border border-slate-700/50 shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-medium truncate ${!notif.read ? 'text-white font-bold' : 'text-slate-300'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                  {notif.message}
                </p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-surface-200/30 border-t border-slate-800/80 text-center">
        <button
          onClick={() => {
            setDrawerOpen(false);
            navigate('/app/alerts');
          }}
          className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1.5"
        >
          <span>View All Operational Alerts</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
