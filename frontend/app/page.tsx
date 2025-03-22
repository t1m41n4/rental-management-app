import React from 'react';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <section className="text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Simplify Your Rental Management
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Manage properties, tenants, and payments all in one place.
        </p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-lg font-medium">
          Get Started Free
        </button>
      </section>

      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Property Management</h3>
          <p className="text-gray-600">List and manage all your rental properties with ease.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Tenant Management</h3>
          <p className="text-gray-600">Keep track of tenants, leases, and communication.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Processing</h3>
          <p className="text-gray-600">Collect rent and manage payments securely online.</p>
        </div>
      </section>
    </Layout>
  );
}
