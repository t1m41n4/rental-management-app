'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await api.post('/login', {
        email,
        password,
      });

      if (response.status === 200) {
        // Handle successful login (e.g., store token, redirect)
        console.log('Login successful', response.data);
        console.log('Access Token:', response.data.access_token); // Debug log: token received
        localStorage.setItem('accessToken', response.data.access_token); // Store access token
        const role = response.data.role; // Assuming role is in response.data
        console.log("Login Response Data:", response.data); // Debug log: full response data
        console.log("Extracted Role:", role); // Debug log: extracted role
        if (role === 'landlord') {
          router.push('/landlord');
        } else if (role === 'tenant') {
          router.push('/tenant');
        } else {
          router.push('/'); // Default to homepage if role is not recognized
        }
      } else {
        setError('Login failed');
        console.log("Login Failed Response:", response); // Debug log: failed response
      }
    } catch (error: unknown) {
      let errorMessage = 'Login failed';
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.detail || 'Login failed';
        console.error("Axios Error Details:", error.response?.data); // Debug log: axios error details
      }
      setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
    }
  };

  interface AxiosErrorResponse {
    response: {
      data: {
        detail?: string;
      };
    };
  }

  function isAxiosError(error: unknown): error is AxiosErrorResponse {
    return error instanceof Error && 'response' in error;
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-8"> {/* Added py-8 for spacing */}
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
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
            <div className="flex items-center justify-between">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
