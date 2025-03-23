import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function useAuthentication() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const user = session?.user;

  const requireAuth = (requiredRole?: string) => {
    if (isLoading) return true;

    if (!isAuthenticated) {
      toast.error('Please login to continue');
      router.push('/login');
      return false;
    }

    if (requiredRole && user?.role !== requiredRole) {
      toast.error('Unauthorized access');
      router.push('/');
      return false;
    }

    return true;
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    requireAuth,
  };
}
