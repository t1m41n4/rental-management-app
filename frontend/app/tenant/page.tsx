"use client";
"use client";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { api, setAuthToken } from "../../lib/api";
import Layout from '@/components/Layout';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MySession } from "@/app/api/auth/[...nextauth]/route"; // Import MySession


interface MaintenanceRequest {
  id: number;
  description: string;
  status: string;
  submitted_at: string;
}

interface TenantDetails {
  email: string | undefined;
  due_date: string | undefined;
  amount: string | undefined;
}

interface TenantDashboardProps {
  session: MySession | null;
}


const TenantDashboard: React.FC<TenantDashboardProps> = ({ session }) => {
  console.log("TenantDashboard - Session Data:", session); // Debug log: session data
  console.log("TenantDashboard - Session Role:", session?.user?.role); // Debug log: session role
  const [details, setDetails] = useState<TenantDetails | null>(null);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (session?.accessToken) {
      setAuthToken(session.accessToken);
      api.get("/tenant/details")
        .then((res) => setDetails(res.data as TenantDetails))
        .catch((error) => console.error("Error fetching tenant details:", error));
      api.get("/tenant/maintenance")
        .then((res) => setMaintenanceRequests(res.data as MaintenanceRequest[]))
        .catch((error) => console.error("Error fetching maintenance requests:", error));
    }
  }, [session?.accessToken]);

  const handleSubmitMaintenance = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await api.post("/tenant/maintenance", { description });
      setMaintenanceRequests([...maintenanceRequests, res.data as MaintenanceRequest]);
      setDescription("");
    } catch (error: any) {
      console.error("Failed to submit maintenance request:", error);
    }
  };


  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Tenant Dashboard</h1>
      <div className="flex justify-end mb-4">
        <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Logout
        </button>
      </div>
      {details && (
        <section className="mb-8 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Rental Details</h2>
          <div className="mb-3"><strong>Email:</strong> <span className="text-indigo-600">{details?.email || 'N/A'}</span></div>
          <div className="mb-3"><strong>Due Date:</strong> <span className="text-indigo-600">{details?.due_date || 'N/A'}</span></div>
          <div><strong>Amount Due:</strong> <span className="text-indigo-600">{details?.amount || 'N/A'}</span></div>
        </section>
      )}
      <section className="p-6 bg-white shadow-md rounded-lg">
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
        <form onSubmit={handleSubmitMaintenance} className="flex flex-col space-y-4">
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue you are experiencing"
            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={5}
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline">
            Submit Maintenance Request
          </button>
        </form>
      </section>
    </div>
  );
};


export default async function TenantPanel() { // Modify component to async
  const session = await getServerSession(authOptions); // Fetch session server-side

  if (session?.user?.role !== "tenant") return <p>Access Denied</p>; // Server-side role check

  return (
    <Layout>
      <TenantDashboard session={session} />
    </Layout>
  );
}
