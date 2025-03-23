'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import { authApi } from '@/lib/api/auth';
import { toast } from 'react-hot-toast';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (token) {
        await authApi.resetPassword(token, newPassword);
        toast.success('Password reset successful');
        router.push('/login');
      } else {
        await authApi.requestPasswordReset(email);
        toast.success('Password reset link sent to your email');
      }
    } catch (error) {
      toast.error('Failed to process password reset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">
          {token ? 'Reset Password' : 'Request Password Reset'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!token ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 border rounded"
              required
            />
          ) : (
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full p-2 border rounded"
              required
            />
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white p-2 rounded"
          >
            {isLoading ? 'Processing...' : token ? 'Reset Password' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
