import React from 'react';
import { Bell, CheckCheck, IndianRupee, MapPinCheckInside, UserCheck, TrendingUp, AlertCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppNotification } from '../../types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setActiveModule, setActiveSubTab } = useApp();

  if (!isOpen) return null;

  const getNotifIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'payroll':
        return <IndianRupee className="w-4 h-4 text-emerald-600" />;
      case 'attendance':
        return <MapPinCheckInside className="w-4 h-4 text-amber-600" />;
      case 'recruitment':
        return <UserCheck className="w-4 h-4 text-sky-600" />;
      case 'review':
        return <TrendingUp className="w-4 h-4 text-indigo-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleActionClick = (notif: AppNotification) => {
    markNotificationRead(notif.id);
    if (notif.actionLink) {
      setActiveModule(notif.actionLink.module);
      if (notif.actionLink.tab) setActiveSubTab(notif.actionLink.tab);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-100">
      <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Notifications Center</h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-700">
              {notifications.filter((n) => !n.read).length} Unread
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={markAllNotificationsRead}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleActionClick(notif)}
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  notif.read
                    ? 'bg-white hover:bg-slate-50 text-slate-600'
                    : 'bg-indigo-50/40 border border-indigo-100/70 hover:bg-indigo-50/80 text-slate-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0">
                    {getNotifIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold truncate text-slate-900">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              No notifications at this moment.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-center text-[11px] text-slate-400">
          Simulated Event Stream • In-Memory Prototype
        </div>
      </div>
    </div>
  );
};
