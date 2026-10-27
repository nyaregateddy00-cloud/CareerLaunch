import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCheck, Inbox, ArrowRight } from 'lucide-react';
import { mockStorage } from '../../lib/mockStorage';
import { NotificationItem } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../lib/utils';
import { useToast } from '../../hooks/useToast';

export const NotificationsPage: React.FC = () => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'application' | 'opportunity'>('all');

  const loadData = () => {
    setNotifications(mockStorage.getNotifications());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('careerlaunch_storage_change', loadData);
    return () => window.removeEventListener('careerlaunch_storage_change', loadData);
  }, []);

  const handleMarkAllRead = () => {
    mockStorage.markAllNotificationsRead();
    loadData();
    showToast('All notifications marked as read', 'success');
  };

  const handleMarkRead = (id: string) => {
    mockStorage.markNotificationRead(id);
    loadData();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'application') return n.type === 'application_update';
    if (filter === 'opportunity') return n.type === 'opportunity_alert';
    return true;
  });

  const filterTabs = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    {
      id: 'application',
      label: 'Applications',
      count: notifications.filter((n) => n.type === 'application_update').length,
    },
    {
      id: 'opportunity',
      label: 'Opportunities',
      count: notifications.filter((n) => n.type === 'opportunity_alert').length,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-slate-900 dark:text-[#f8fafc]">
      <PageHeader
        title="Notifications"
        subtitle="Updates on your applications, matching opportunities, and platform notices."
        breadcrumbs={[{ label: 'Notifications' }]}
        badge={
          unreadCount > 0 ? (
            <Badge variant="green" size="sm">
              {unreadCount} Unread
            </Badge>
          ) : undefined
        }
        action={
          unreadCount > 0 ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handleMarkAllRead}
              leftIcon={<CheckCheck className="w-4 h-4" />}
            >
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as typeof filter)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filter === tab.id
                ? 'bg-brand-blue-900 dark:bg-brand-blue-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#111111] border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/[0.08]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                filter === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 dark:bg-white/[0.08] text-slate-600 dark:text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {filteredNotifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description={
            filter === 'unread'
              ? 'You have read all your notifications.'
              : 'There are no notifications matching your current filter.'
          }
          icon={<Inbox className="w-10 h-10 text-slate-400" />}
          action={
            filter !== 'all' ? (
              <Button size="sm" variant="outline" onClick={() => setFilter('all')}>
                Show All Notifications
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <Card
              key={n.id}
              onClick={() => handleMarkRead(n.id)}
              className={`p-5 transition-all cursor-pointer ${
                !n.isRead
                  ? 'border-l-4 border-l-brand-green-500 bg-brand-green-50/20 dark:bg-brand-green-950/20'
                  : 'opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</h4>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-brand-green-500 shrink-0"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {n.message}
                  </p>
                  <div className="text-[10px] text-slate-400 pt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(n.createdAt)}
                  </div>
                </div>

                {n.actionUrl && (
                  <Link to={n.actionUrl} className="shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      View
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
