"use client";

import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { api, setAuthToken } from "../../lib/api";
import Layout from '@/components/Layout';
import { MaintenanceRequest, TenantDetails } from '@/types/api';
import AuthGuard from "@/components/AuthGuard";
import { toast } from 'react-hot-toast';

const TenantDashboard = () => {
  const [details, setDetails] = useState<TenantDetails | null>(null);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [detailsRes, requestsRes] = await Promise.all([
        api.get("/tenant/details"),
        api.get("/tenant/maintenance")
      ]);
      setDetails(detailsRes.data);
      setMaintenanceRequests(requestsRes.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitMaintenance = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/tenant/maintenance", { description });
      setMaintenanceRequests(prev => [...prev, res.data]);
      setDescription("");
      toast.success("Maintenance request submitted successfully");
    } catch (error) {
      toast.error("Failed to submit maintenance request");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Tenant Dashboard</h1>
      <div className="flex justify-end mb-4">
        <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Logout
        </button>
      </div>
      {details && (
        <section className="mb-8 p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Rental Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-3">
              <strong className="text-gray-700">Property:</strong>
              <p className="text-indigo-600">{details.property.name}</p>
              <p className="text-sm text-gray-600">{details.property.address}</p>
            </div>
            <div className="mb-3"><strong>Email:</strong> <span className="text-indigo-600">{details?.email || 'N/A'}</span></div>
            <div className="mb-3"><strong>Due Date:</strong> <span className="text-indigo-600">{details?.due_date || 'N/A'}</span></div>
            <div><strong>Amount Due:</strong> <span className="text-indigo-600">{details?.amount || 'N/A'}</span></div>
          </div>
        </section>
      )}
      <section className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Maintenance Requests</h2>
        <ul className="mb-5 space-y-3">
          {maintenanceRequests.map((request: MaintenanceRequest) => (
            <li key={request.id} className="p-4 border border-gray-200 rounded-md">
              <p className="mb-2"><strong className="text-gray-800">Request:</strong> {request.description}</p>
              <p className="text-sm text-gray-700"><strong>Status:</strong> <span className="font-medium">{request.status}</span></p>
              <p className="text-sm text-gray-700"><strong>Submitted:</strong> {request.submitted_at}</p>
            </li>
          ))}
        </ul>
        <h3 className="text-lg font-semibold text-gray-800 mt-5 mb-3">Submit New Request</h3>
        <form onSubmit={handleSubmitMaintenance} className="mt-6">
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue you are experiencing"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={5}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Maintenance Request'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default function TenantPanel() {
  return (
    <AuthGuard requiredRole="tenant">
      <Layout>
        <TenantDashboard />
      </Layout>
    </AuthGuard>
  );
}
