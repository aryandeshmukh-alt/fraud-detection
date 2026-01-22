import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Check,
  CheckCheck,
  AlertTriangle,
  Info,
  AlertCircle,
} from "lucide-react";
import {
  Button,
  Card,
  Badge,
  EmptyState,
  PageLoader,
  Pagination,
} from "@/components/ui";
import { notificationsApi } from "@/api";
import { formatRelativeTime } from "@/utils";
import type { Notification } from "@/types";

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", { page, unread_only: showUnreadOnly }],
    queryFn: () =>
      notificationsApi.getAll({ page, limit: 10, unread_only: showUnreadOnly }),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
    },
  });

  const getNotificationIcon = (type: Notification["Type"]) => {
    switch (type) {
      case "ALERT":
        return <AlertCircle className="h-5 w-5 text-danger-600" />;
      case "WARNING":
        return <AlertTriangle className="h-5 w-5 text-warning-600" />;
      default:
        return <Info className="h-5 w-5 text-primary-600" />;
    }
  };

  const getNotificationBg = (type: Notification["Type"], isRead: boolean) => {
    if (isRead) return "bg-surface-50 dark:bg-surface-800/50";

    switch (type) {
      case "ALERT":
        return "bg-danger-50/50 dark:bg-danger-500/5";
      case "WARNING":
        return "bg-warning-50/50 dark:bg-warning-500/5";
      default:
        return "bg-primary-50/50 dark:bg-primary-500/5";
    }
  };

  if (isLoading) {
    return <PageLoader message="Loading notifications..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            Notifications
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Stay updated with your transaction alerts
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showUnreadOnly ? "primary" : "outline"}
            size="sm"
            onClick={() => {
              setShowUnreadOnly(!showUnreadOnly);
              setPage(1);
            }}
          >
            {showUnreadOnly ? "All" : "Unread Only"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<CheckCheck className="h-4 w-4" />}
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
          >
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Notifications list */}
      <Card padding="none">
        {data?.data?.length === 0 ? (
          <EmptyState
            icon={<Bell className="h-6 w-6 text-surface-400" />}
            title="No notifications"
            description={
              showUnreadOnly
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."
            }
          />
        ) : (
          <div className="divide-y dark:divide-surface-700">
            {data?.data?.map((notification) => (
              <div
                key={notification.ID}
                className={`flex gap-4 p-4 transition-colors ${getNotificationBg(
                  notification.Type,
                  notification.IsRead,
                )}`}
              >
                <div className="shrink-0 mt-0.5">
                  {getNotificationIcon(notification.Type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`text-sm font-medium ${
                        notification.IsRead
                          ? "text-surface-600 dark:text-surface-400"
                          : "text-surface-900 dark:text-surface-100"
                      }`}
                    >
                      {notification.Title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant={
                          notification.Type === "ALERT"
                            ? "danger"
                            : notification.Type === "WARNING"
                              ? "warning"
                              : "info"
                        }
                        size="sm"
                      >
                        {notification.Type}
                      </Badge>
                      {!notification.IsRead && (
                        <button
                          onClick={() =>
                            markAsReadMutation.mutate(notification.ID)
                          }
                          className="p-1 rounded text-surface-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p
                    className={`mt-1 text-sm ${
                      notification.IsRead
                        ? "text-surface-500 dark:text-surface-500"
                        : "text-surface-600 dark:text-surface-400"
                    }`}
                  >
                    {notification.Message}
                  </p>
                  <p className="mt-2 text-xs text-surface-400">
                    {formatRelativeTime(notification.CreatedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {data && data.total_pages > 1 && (
          <div className="border-t p-4">
            <Pagination
              currentPage={page}
              totalPages={data.total_pages}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
