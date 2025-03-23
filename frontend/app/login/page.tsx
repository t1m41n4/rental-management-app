'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { toast } from 'react-hot-toast';
import { useAuthentication } from '@/hooks/useAuthentication';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      toast.error('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        remember: rememberMe,
        redirect: false,
      });

      if (result?.error) {
        const errorMessage = 'Invalid email or password';
        toast.error(errorMessage);
        setError(errorMessage);
        return;
      }

      const { user } = useAuthentication();
      if (user?.role === 'landlord') {
        toast.success('Welcome back, Landlord!');
        router.push('/landlord');
      } else if (user?.role === 'tenant') {
        toast.success('Welcome back, Tenant!');
        router.push('/tenant');
      }
    } catch (err) {
      const errorMessage = 'Login failed. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-8">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 mb-4">
              {error}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
