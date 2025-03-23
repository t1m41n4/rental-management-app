import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(requiredRole?: 'tenant' | 'landlord') {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && requiredRole) {
      if (session?.user?.role !== requiredRole) {
        router.push('/');
      }
    }
  }, [status, session, requiredRole, router]);

  return { session, status, isAuthorized: !requiredRole || session?.user?.role === requiredRole };
}
