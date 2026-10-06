import React, { useState, useEffect, useMemo } from 'react';
import { Bell, CheckCheck, Clock, ArrowRight, CheckCircle2, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockStorage } from '../../lib/mockStorage';
import { Notification } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../lib/utils';

export const NotificationsPage: React.FC = () => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(() => mockStorage.getNotifications());
  const [filter, setFilter] = useState<'all' | 'unread' | 'opportunities' | 'applications' | 'learning' | 'achievements' | 'community' | 'system'>('all');

  const loadData = () => {
    setNotifications(mockStorage.getNotifications());
  };

  useEffect(() => {
    const handleStorage = (event: Event) => {
      const key = (event as CustomEvent<{ key?: string }>).detail?.key;
      if (!key || key === 'careerlaunch_notifications') loadData();
    };
    window.addEventListener('careerlaunch_storage_change', handleStorage);
    return () => window.removeEventListener('careerlaunch_storage_change', handleStorage);
  }, []);

  const handleMarkAllRead = () => {
    mockStorage.markAllNotificationsAsRead();
    loadData();
    showToast('All notifications marked as read', 'success');
  };

  const handleMarkRead = (id: string) => {
    mockStorage.markNotificationAsRead(id);
    loadData();
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === 'unread') return !n.isRead;
      if (filter === 'opportunities') return n.type === 'opportunity';
      if (filter === 'applications') return n.type === 'application' || n.type === 'interview';
      if (filter === 'learning') return n.type === 'learning';
      if (filter === 'achievements') return n.type === 'achievement';
      if (filter === 'community') return n.type === 'community';
      if (filter === 'system') return n.type === 'system';
      return true;
    });
  }, [notifications, filter]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Review notification items saved in your workspace. Live delivery depends on notification services configured for this deployment."
        breadcrumbs={[{ label: 'Notifications' }]}
        badge={
          unreadCount > 0 ? (
            <Badge variant="accent" size="sm">
              {unreadCount} Unread
            </Badge>
          ) : (
            <Badge variant="outline" size="sm">
              All Caught Up
            </Badge>
          )
        }
        action={
          unreadCount > 0 ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleMarkAllRead}
              leftIcon={<CheckCheck className="w-4 h-4" />}
            >
              Mark All Read
            </Button>
          ) : undefined
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'All', count: notifications.length },
          { id: 'unread', label: 'Unread', count: unreadCount },
          {
            id: 'opportunities',
            label: 'Opportunities',
            count: notifications.filter((n) => n.type === 'opportunity').length,
          },
          {
            id: 'applications',
            label: 'Applications',
            count: notifications.filter((n) => n.type === 'application' || n.type === 'interview').length,
          },
          ...(['learning', 'achievements', 'community', 'system'] as const).map((id) => ({ id, label: id[0].toUpperCase() + id.slice(1), count: notifications.filter((item) => item.type === id).length })),
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as typeof filter)}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filter === tab.id
                ? 'bg-brand-blue-900 dark:bg-brand-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filter === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
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
              ? 'You have read all your notifications!'
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
                  ? 'border-l-4 border-l-brand-green-500 bg-brand-green-50/10 dark:bg-brand-green-950/20'
                  : 'opacity-85'
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
