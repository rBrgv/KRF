import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  try {
    // Check if Supabase environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('[Middleware] Missing Supabase environment variables');
      // Return response without Supabase session handling
      return NextResponse.next({ request });
    }

    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            request.cookies.set(name, value);
            supabaseResponse = NextResponse.next({
              request,
            });
            supabaseResponse.cookies.set(name, value, options);
          },
          remove(name: string, options: any) {
            request.cookies.set(name, '');
            supabaseResponse = NextResponse.next({
              request,
            });
            supabaseResponse.cookies.set(name, '', { ...options, maxAge: 0 });
          },
        },
      }
    );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // Debug logging (development only)
  if (process.env.NODE_ENV === 'development' && request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('[Middleware] Dashboard access attempt');
    console.log('[Middleware] User:', user?.email || 'none');
    if (userError) {
      console.log('[Middleware] Error:', userError.message);
    }
  }

  // Protect dashboard routes (admin/trainer only)
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/portal'))
  ) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware] No user found, redirecting to login');
    }
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Protect portal routes - check if user is a client
  if (user && request.nextUrl.pathname.startsWith('/portal')) {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      // If no profile exists, allow access (will be created on next login)
      // But if profile exists and is not client, redirect to dashboard
      if (profile && profile.role !== 'client') {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
    } catch (err) {
      // If profile doesn't exist, allow access (will be created)
      console.log('[Middleware] No profile found for user, allowing access');
    }
  }

  // Protect dashboard routes - check if user is admin/trainer
  if (user && request.nextUrl.pathname.startsWith('/dashboard')) {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      // If no profile exists, assume admin (existing users)
      // If profile exists and is client, redirect to portal
      if (profile && profile.role === 'client') {
        const url = request.nextUrl.clone();
        url.pathname = '/portal';
        return NextResponse.redirect(url);
      }
      // If no profile, allow access (assume admin for existing users)
    } catch (err) {
      // If profile doesn't exist, allow access (assume admin for existing users)
      console.log('[Middleware] No profile found for user, allowing dashboard access');
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely.

  return supabaseResponse;
}

