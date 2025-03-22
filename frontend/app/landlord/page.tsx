"use client";
"use client";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { api, setAuthToken } from "../../lib/api";
import Layout from '@/components/Layout';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface Tenant {
  id: number;
  email: string;
}

import { MySession } from "@/app/api/auth/[...nextauth]/route"; // Import MySession

interface LandlordDashboardProps {
  session: MySession | null;
}

const LandlordDashboard: React.FC<LandlordDashboardProps> = ({ session }) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (session?.accessToken) {
      setAuthToken(session.accessToken);
      api.get("/landlord/tenants").then((res) => {
        setTenants(res.data as Tenant[]);
        console.log("Tenants data:", res.data);
      }).catch(error => {
        console.error("Error fetching tenants:", error);
      });
    }
  }, [session?.accessToken]);

  const handleAddTenant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await api.post("/landlord/tenants", { email, password });
      setTenants([...tenants, { id: res.data.tenant_id, email }]);
      setEmail("");
      setPassword("");
      console.log("Add tenant response:", res);
      console.log("Request payload:", { email, password });
    } catch (error) {
      console.error("Failed to add tenant:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Landlord Dashboard</h1>
      <div className="flex justify-end mb-4">
        <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Logout
        </button>
      </div>
      <section className="mb-8 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tenants</h2>
        <ul className="space-y-3">
          {tenants.map((tenant: Tenant) => (
            <li key={tenant.id} className="p-3 bg-gray-50 rounded-md shadow-sm flex items-center justify-between">
              <span className="font-medium text-gray-800">{tenant.email}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Tenant</h2>
        <form onSubmit={handleAddTenant} className="flex flex-col space-y-4">
          <div
            id="email-label"
            className="block text-sm font-medium text-gray-700"
          >Email
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="tenant@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">
            Add Tenant
          </button>
        </form>
      </section>
    </div>
  );
};


// Define LandlordPanel component as async to use getServerSession
export default async function LandlordPanel() { // Modify component to async
  const session = await getServerSession(authOptions); // Fetch session server-side

  if (session?.user?.role !== "landlord") { // Server-side role check
    return <p>Access Denied</p>; // Render "Access Denied" server-side if role is incorrect
  }

  return (
    <Layout>
      <LandlordDashboard session={session} />
    </Layout>
  );
}
