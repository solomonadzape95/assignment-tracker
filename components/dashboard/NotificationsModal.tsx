"use client";

import { Icon } from "@/components/common/Icon";
import type { NotificationItem } from "@/hooks/useNotifications";

interface NotificationsModalProps {
  open: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  loading: boolean;
  error: string | null;
  onMarkAllRead: () => Promise<void>;
}

export function NotificationsModal({
  open,
  onClose,
  notifications,
  loading,
  error,
  onMarkAllRead,
}: NotificationsModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-md rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl shadow-black/40 overflow-hidden">
        <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Icon
              name="notifications"
              size={20}
              className="text-primary"
              aria-label="Notifications"
            />
            <h2 className="text-sm font-semibold text-slate-100">
              Notifications
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={async () => {
                  await onMarkAllRead();
                }}
                className="text-[10px] font-semibold uppercase tracking-wide text-slate-300 hover:text-primary px-2 py-1 rounded-full hover:bg-slate-800 transition-colors"
              >
                Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-800 text-slate-300"
              aria-label="Close notifications"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        </header>

        <section className="max-h-[60vh] overflow-y-auto px-4 py-3 space-y-3">
          {loading ? (
            <p className="text-xs text-slate-400">Loading notifications…</p>
          ) : error ? (
            <p className="text-xs text-red-400">{error}</p>
          ) : notifications.length === 0 ? (
            <p className="text-xs text-slate-400">
              You have no notifications yet.
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5"
              >
                <p className="text-xs font-medium text-slate-100">
                  {n.title}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

