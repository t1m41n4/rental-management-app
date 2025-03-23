'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import Layout from '@/components/Layout';
import type { ApiError } from '@/types/api';
import { toast } from 'react-hot-toast';
import { object, string } from 'yup';

const validationSchema = object({
  email: string().email('Invalid email').required('Email is required'),
  password: string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  role: string().oneOf(['tenant', 'landlord'], 'Please select a role').required('Role is required'),
});

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate form data
      await validationSchema.validate(formData);

      await authApi.register(formData.email, formData.password, formData.role);
      toast.success('Registration successful!');
      router.push('/login?registered=true');
    } catch (err) {
      if (err.name === 'ValidationError') {
        setError(err.message);
        toast.error(err.message);
      } else {
        const apiError = err as { response?: { data: ApiError } };
        const errorMessage = apiError.response?.data?.detail || 'Registration failed. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-8">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register</h2>
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Role
              </label>
              <div className="flex space-x-4">
                <div className="space-x-2">
                  <input
                    type="radio"
                    id="tenantRole"
                    value="tenant"
                    name="role"
                    className="mr-2"
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                  <label htmlFor="tenantRole">Tenant</label>
                </div>
                <div className="space-x-2">
                  <input
                    type="radio"
                    id="landlordRole"
                    value="landlord"
                    name="role"
                    className="mr-2"
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                  <label htmlFor="landlordRole">Landlord</label>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
