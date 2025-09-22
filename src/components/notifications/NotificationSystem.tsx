import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, BellRing, Check, X } from 'lucide-react';
import { Notification, mockApiService, mockWebSocket } from '@/services/mockApi';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

const notificationTypeColors = {
  info: 'bg-primary text-primary-foreground',
  warning: 'bg-warning text-black',
  success: 'bg-success text-white',
  error: 'bg-destructive text-destructive-foreground',
};

interface NotificationSystemProps {
  showInbox?: boolean;
  limit?: number;
}

export function NotificationSystem({ showInbox = false, limit }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        const data = await mockApiService.getNotifications(user.id);
        setNotifications(limit ? data.slice(0, limit) : data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Set up real-time notifications
    const handleNewNotification = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      
      // Show toast for new notifications
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === 'error' ? 'destructive' : 'default',
        duration: 5000,
      });
    };

    mockWebSocket.on('new_notification', handleNewNotification);

    return () => {
      // In a real app, you'd unsubscribe here
    };
  }, [user, limit]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await mockApiService.markNotificationRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleSimulateNotification = () => {
    mockWebSocket.simulateNotification();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (showInbox) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center space-x-2">
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          {process.env.NODE_ENV === 'development' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSimulateNotification}
            >
              Add Notification
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {notifications.length === 0 ? (
              <EmptyState
                icon={<Bell className="h-8 w-8" />}
                title="No notifications"
                description="You're all caught up!"
              />
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-all ${
                      notification.read 
                        ? 'bg-card border-border opacity-75' 
                        : 'bg-accent/10 border-accent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <Badge 
                            className={notificationTypeColors[notification.type]}
                            variant="secondary"
                          >
                            {notification.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="ml-2"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  // Quick notification widget for dashboard
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5 text-warning" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          <span>Recent Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No new notifications</p>
        ) : (
          <div className="space-y-2">
            {notifications.slice(0, 3).map((notification) => (
              <div
                key={notification.id}
                className={`p-2 rounded border text-xs ${
                  notification.read ? 'opacity-75' : ''
                }`}
              >
                <div className="font-medium">{notification.title}</div>
                <div className="text-muted-foreground truncate">
                  {notification.message}
                </div>
              </div>
            ))}
            {notifications.length > 3 && (
              <p className="text-xs text-muted-foreground text-center">
                +{notifications.length - 3} more
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}