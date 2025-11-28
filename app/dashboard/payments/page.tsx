import { createClient } from '@/lib/supabase/server';
import { formatDate, formatCurrency } from '@/lib/utils';

export default async function PaymentsPage() {
  const supabase = await createClient();

  const { data: payments, error } = await supabase
    .from('payments')
    .select(`
      *,
      clients:client_id (name),
      event_registrations:event_registration_id (name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  const statusColors: Record<string, string> = {
    success: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Payments</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments?.map((payment: any) => (
              <tr key={payment.id}>
                <td className="px-6 py-4">{formatDate(payment.created_at)}</td>
                <td className="px-6 py-4">
                  {payment.clients?.name || payment.event_registrations?.name || '-'}
                </td>
                <td className="px-6 py-4 font-semibold">
                  {formatCurrency(Number(payment.amount), payment.currency)}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${statusColors[payment.status] || 'bg-gray-100'}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {payment.razorpay_payment_id || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

