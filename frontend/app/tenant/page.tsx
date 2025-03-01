// frontend/app/tenant/page.tsx
"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { api, setAuthToken } from "../../lib/api";

export default function TenantPanel() {
  const { data: session, status } = useSession();
  const [details, setDetails] = useState<any>(null);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (session?.accessToken) {
      setAuthToken(session.accessToken);
      api.get("/tenant/details").then((res) => setDetails(res.data));
      api.get("/tenant/maintenance").then((res) => setMaintenanceRequests(res.data));
    }
  }, [session]);

  const handleSubmitMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/tenant/maintenance", { description });
      setMaintenanceRequests([...maintenanceRequests, res.data]);
      setDescription("");
    } catch (error) {
      console.error("Failed to submit maintenance request:", error);
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!session || session.user.role !== "tenant") return <p>Access Denied</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl">Tenant Dashboard</h1>
      <button onClick={() => signOut()} className="bg-red-500 text-white p-2 mb-4">
        Logout
      </button>
      {details && (
        <section>
          <h2>Rental Details</h2>
          <p>Email: {details.email}</p>
          <p>Due Date: {details.due_date}</p>
          <p>Amount: {details.amount}</p>
        </section>
      )}
      <section>
        <h2>Maintenance Requests</h2>
        <ul>
          {maintenanceRequests.map((m: any) => (
            <li key={m.id}>
              {m.description} - {m.status} (Submitted: {m.submitted_at})
            </li>
          ))}
        </ul>
        <h3>Submit New Request</h3>
        <form onSubmit={handleSubmitMaintenance}>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue"
            className="border p-2 mr-2 w-full"
          />
          <button type="submit" className="bg-blue-500 text-white p-2">
            Submit
          </button>
        </form>
      </section>
    </div>
  );
}