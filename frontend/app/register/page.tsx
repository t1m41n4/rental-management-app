'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/register', {
        email,
        password,
        role: document.querySelector<HTMLInputElement>('input[name="role"]:checked')?.value, // Get selected role
      });

      if (response.status === 200) {
        setSuccess('Registration successful!');
        // Optionally redirect user to login page or dashboard
      } else {
        setError('Registration failed');
      }
    } catch (error: unknown) {
      let errorMessage = 'Registration failed';
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.detail || 'Registration failed';
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register</h2>
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
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
                  />
                  <label htmlFor="landlordRole">Landlord</label>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
