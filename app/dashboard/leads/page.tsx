import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { LeadsList } from '@/components/dashboard/LeadsList';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const params = await searchParams;
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const limit = typeof params.limit === 'string' ? parseInt(params.limit) : 20;
  const status = typeof params.status === 'string' ? params.status : undefined;
  const source = typeof params.source === 'string' ? params.source : undefined;
  const search = typeof params.search === 'string' ? params.search : undefined;

  // Fetch leads directly from Supabase
  const supabase = await createClient();
  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  // Apply filters
  if (status) {
    query = query.eq('status', status);
  }
  if (source) {
    query = query.eq('source', source);
  }
  if (search) {
    // Sanitize search input to prevent SQL injection
    const { sanitizeSearchInput } = await import('@/lib/utils/sanitize');
    const sanitizedSearch = sanitizeSearchInput(search);
    query = query.or(
      `name.ilike.%${sanitizedSearch}%,email.ilike.%${sanitizedSearch}%,phone.ilike.%${sanitizedSearch}%`
    );
  }

  // Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching leads:', error);
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">Leads</h1>
        <Link
          href="/dashboard/leads/new"
          className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 premium-glow flex items-center gap-2"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Lead
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </Link>
      </div>
      <LeadsList
        initialLeads={data || []}
        pagination={{
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        }}
        initialFilters={{ status, source, search }}
      />
    </div>
  );
}
