import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { NotificationWithClient, NotificationType, NotificationStatus } from '@/lib/types';
import { Bell, CheckCircle, XCircle, Clock, Mail, MessageCircle } from 'lucide-react';
import { NotificationsComposeSection } from '@/components/dashboard/NotificationsComposeSection';

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const params = await searchParams;
  const typeFilter = typeof params.type === 'string' ? params.type : undefined;
  const statusFilter = typeof params.status === 'string' ? params.status : undefined;
  const days = typeof params.days === 'string' ? parseInt(params.days) : 7;

  const supabase = await createClient();

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Build query
  let query = supabase
    .from('notifications')
    .select(`
      *,
      clients:client_id (
        id,
        name,
        email,
        phone
      )
    `)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: false })
    .limit(100);

  if (typeFilter) {
    query = query.eq('type', typeFilter);
  }

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data: notifications, error } = await query;

  if (error) {
    console.error('Error fetching notifications:', error);
  }

  const getStatusBadge = (status: NotificationStatus) => {
    switch (status) {
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Sent
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 rounded-full">
            <XCircle className="w-3 h-3" />
            Failed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      default:
        return <span className="text-gray-400">{status}</span>;
    }
  };

  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case 'appointment_reminder':
        return 'Appointment Reminder';
      case 'payment_reminder':
        return 'Payment Reminder';
      case 'membership_expiry':
        return 'Membership Expiry';
      case 'general':
        return 'General Email';
      default:
        return type;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="w-4 h-4 text-blue-400" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4 text-green-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">Notifications</h1>
            <p className="text-gray-400 text-lg">View and monitor notification history</p>
          </div>
        </div>
      </div>

      {/* Compose Email Section */}
      <NotificationsComposeSection />

      {/* Filters */}
      <form action="/dashboard/notifications" method="get" className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
            <select
              name="type"
              defaultValue={typeFilter || ''}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="appointment_reminder">Appointment Reminder</option>
              <option value="payment_reminder">Payment Reminder</option>
              <option value="membership_expiry">Membership Expiry</option>
              <option value="general">General Email</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              name="status"
              defaultValue={statusFilter || ''}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Days</label>
            <select
              name="days"
              defaultValue={days.toString()}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="14">Last 14 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30"
            >
              Apply Filters
            </button>
            <a
              href="/dashboard/notifications"
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Clear
            </a>
          </div>
        </div>
      </form>

      {/* Notifications Table */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Channel
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Scheduled
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Sent
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {notifications && notifications.length > 0 ? (
                notifications.map((notification: NotificationWithClient) => (
                  <tr
                    key={notification.id}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {notification.clients?.name || 'Unknown Client'}
                      </div>
                      {notification.clients?.email && (
                        <div className="text-xs text-gray-400">{notification.clients.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-300">
                        {getTypeLabel(notification.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getChannelIcon(notification.channel)}
                        <span className="text-sm text-gray-300 capitalize">
                          {notification.channel}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {formatDate(notification.scheduled_at)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(notification.scheduled_at).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {notification.sent_at ? (
                        <>
                          <div className="text-sm text-gray-300">
                            {formatDate(notification.sent_at)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(notification.sent_at).toLocaleTimeString()}
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(notification.status)}
                      {notification.error_message && (
                        <div className="text-xs text-red-400 mt-1 max-w-xs truncate" title={notification.error_message}>
                          {notification.error_message}
                        </div>
                      )}
                      {notification.status === 'sent' && notification.payload && typeof notification.payload === 'object' && 'resend_email_id' in notification.payload && notification.payload.resend_email_id && (
                        <div className="mt-1">
                          <a
                            href={`https://resend.com/emails/${notification.payload.resend_email_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:text-blue-300 underline"
                            title="View email status in Resend dashboard"
                          >
                            Track in Resend →
                          </a>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-400 text-lg">No notifications found</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Notifications will appear here once generated
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

