import { redirect } from 'next/navigation';
import { getClientByUserId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { formatDate, formatCurrency } from '@/lib/utils';
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';

export default async function PortalPaymentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const client = await getClientByUserId(user.id);

  if (!client) {
    redirect('/portal');
  }

  // Fetch payments for this client
  // Note: payments table may not have client_id directly, check via event_registrations
  const { data: eventRegistrations } = await supabase
    .from('event_registrations')
    .select(`
      *,
      payments:payment_id (*),
      events:event_id (title)
    `)
    .or(`email.eq.${client.email},phone.eq.${client.phone}`)
    .order('created_at', { ascending: false });

  // Also check direct payments if client_id exists
  const { data: directPayments } = await supabase
    .from('payments')
    .select('*')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false });

  // Combine and format payments
  const payments: any[] = [];
  
  if (directPayments) {
    payments.push(...directPayments.map(p => ({
      ...p,
      amount: p.amount_in_inr,
      events: null,
    })));
  }

  if (eventRegistrations) {
    eventRegistrations.forEach((reg: any) => {
      if (reg.payments) {
        payments.push({
          ...reg.payments,
          amount: reg.payments.amount_in_inr,
          events: { title: reg.events?.title },
        });
      }
    });
  }

  // Sort by created_at
  payments.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Calculate summary
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const successfulPayments = payments.filter(p => p.status === 'completed').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">Payment History</h1>
            <p className="text-gray-400 text-lg">View your payment transactions</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Paid</p>
              <p className="text-3xl font-bold text-white">
                {formatCurrency(totalPaid, 'INR')}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Successful Payments</p>
              <p className="text-3xl font-bold text-white">{successfulPayments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-transparent">
          <h2 className="text-xl font-bold text-white">All Payments</h2>
        </div>
        <div className="p-6">
          {payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment) => {
                // Get event title from payment or registration
                const eventTitle = payment.events?.title || 'Program Payment';

                return (
                  <div
                    key={payment.id}
                    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/30 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          {getStatusIcon(payment.status)}
                          <h3 className="text-lg font-bold text-white">{eventTitle}</h3>
                          <span className={`px-3 py-1.5 text-xs font-medium rounded-full border ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-300">
                          <p>
                            <span className="font-semibold text-white">Amount:</span>{' '}
                            <span className="text-green-400 font-bold text-lg">
                              {formatCurrency(Number(payment.amount || 0), 'INR')}
                            </span>
                          </p>
                          <p>
                            <span className="font-semibold text-white">Date:</span>{' '}
                            <span className="text-gray-300">{formatDate(payment.created_at)}</span>
                          </p>
                          {payment.payment_method && (
                            <p>
                              <span className="font-semibold text-white">Method:</span>{' '}
                              <span className="text-gray-300">{payment.payment_method}</span>
                            </p>
                          )}
                          {payment.razorpay_payment_id && (
                            <p>
                              <span className="font-semibold text-white">Transaction ID:</span>{' '}
                              <span className="font-mono text-xs text-gray-400">{payment.razorpay_payment_id}</span>
                            </p>
                          )}
                          {payment.type && (
                            <p>
                              <span className="font-semibold text-white">Type:</span>{' '}
                              <span className="text-gray-300">{payment.type}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <CreditCard className="w-20 h-20 text-gray-600 mx-auto mb-6 opacity-50" />
              <p className="text-gray-400 text-lg">No payment history</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

