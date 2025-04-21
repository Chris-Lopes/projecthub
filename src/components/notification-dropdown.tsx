"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.length; // Since we only fetch unread notifications

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();

    // Set up polling for notifications every minute
    const intervalId = setInterval(fetchNotifications, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getNotifications();
      if (!result.error && result.notifications) {
        setNotifications(result.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMarkAsRead = useCallback(
    async (notificationId: string, e?: React.MouseEvent) => {
      e?.stopPropagation();

      try {
        const result = await markNotificationAsRead(notificationId);
        if (!result.error) {
          // Remove the notification from the list
          setNotifications((prev) =>
            prev.filter((n) => n.id !== notificationId)
          );
        }
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    },
    []
  );

  const getNotificationIcon = useCallback((type: NotificationType) => {
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
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative text-gray-300 hover:text-white hover:bg-[#1a1a30]/50 focus:ring-2 focus:ring-purple-500/30 focus:ring-offset-2 focus:ring-offset-[#141428] transition-all duration-200"
        onClick={toggleDropdown}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-purple-500 text-xs text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#141428]/90 backdrop-blur-sm rounded-lg shadow-xl py-2 z-50 border border-purple-900/50 transition-all duration-200 animate-in fade-in slide-in-from-top-5">
          <div className="px-4 py-2 border-b border-purple-900/50">
            <h3 className="text-sm font-medium text-white flex items-center justify-between">
              <span>Notifications</span>
              {isLoading && (
                <span className="text-xs text-gray-400">Refreshing...</span>
              )}
            </h3>
          </div>

          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-[#141428]/50">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="px-4 py-3 hover:bg-[#1a1a30]/50 transition-all border-b border-purple-900/30 last:border-b-0"
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
                      className="text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-900/30 rounded-full px-2 py-1 h-auto transition-all"
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                    >
                      Mark as read
                    </Button>
                  </div>
                  {notification.projectId && (
                    <Link
                      href={`/projects/${notification.projectId}`}
                      className="text-xs text-purple-400 hover:text-purple-300 mt-2 inline-flex items-center group"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      View project{" "}
                      <span className="ml-1 group-hover:translate-x-0.5 transition-transform">
                        →
                      </span>
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-sm text-gray-400 text-center">
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-3 w-3 bg-purple-500 rounded-full animate-ping"></div>
                    <span>Loading notifications...</span>
                  </div>
                ) : (
                  "No new notifications"
                )}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-purple-900/50 text-right">
              <button
                onClick={() =>
                  notifications.forEach((n) => handleMarkAsRead(n.id))
                }
                className="text-xs text-purple-400 hover:text-purple-300 hover:underline"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
