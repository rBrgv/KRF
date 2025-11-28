import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { ClientsList } from '@/components/dashboard/ClientsList';

export default async function ClientsPage({
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
  const search = typeof params.search === 'string' ? params.search : undefined;

  // Fetch clients directly from Supabase
  const supabase = await createClient();
  let query = supabase
    .from('clients')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  // Apply search filter
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
    console.error('Error fetching clients:', error);
  }

  return (
    <div className="p-4 lg:p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Clients</h1>
      <ClientsList
        initialClients={data || []}
        pagination={{
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        }}
        initialSearch={search}
      />
    </div>
  );
}
