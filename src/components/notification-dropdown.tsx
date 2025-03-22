import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { getNotifications, markNotificationAsRead } from "@/app/actions";
import Link from "next/link";
import { NotificationType } from "@prisma/client";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  projectId: string | null;
  project: {
    name: string;
  } | null;
  createdAt: Date;
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.length; // Since we only fetch unread notifications

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const result = await getNotifications();
    if (!result.error && result.notifications) {
      setNotifications(result.notifications);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    const result = await markNotificationAsRead(notificationId);
    if (!result.error) {
      // Remove the notification from the list
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "PROJECT_APPROVED":
        return "✅";
      case "PROJECT_REJECTED":
        return "❌";
      case "NEW_COMMENT":
        return "💬";
      default:
        return "📢";
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative text-gray-300 hover:text-gray-100 hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5 text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-purple-500 text-xs text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-700">
            <h3 className="text-sm font-medium text-gray-200">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="px-4 py-3 hover:bg-gray-700 transition-colors bg-gray-700/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm text-gray-200">
                        <span
                          className="mr-2"
                          role="img"
                          aria-label="notification type"
                        >
                          {getNotificationIcon(notification.type)}
                        </span>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-900/50"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      Mark as read
                    </Button>
                  </div>
                  {notification.projectId && (
                    <Link
                      href={`/projects/${notification.projectId}`}
                      className="text-xs text-purple-400 hover:text-purple-300 mt-2 inline-block"
                    >
                      View project →
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
