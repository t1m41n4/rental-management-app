"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { api, setAuthToken } from "../../lib/api";

export default function LandlordPanel() {
  const { data: session, status } = useSession();
  const [tenants, setTenants] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (session?.accessToken) {
      setAuthToken(session.accessToken);
      api.get("/landlord/tenants").then((res) => setTenants(res.data));
    }
  }, [session]);

  const handleAddTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/landlord/tenants", { email, password });
      setTenants([...tenants, { id: res.data.tenant_id, email }]);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Failed to add tenant:", error);
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!session || session.user.role !== "landlord") return <p>Access Denied</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl">Landlord Dashboard</h1>
      <button onClick={() => signOut()} className="bg-red-500 text-white p-2 mb-4">
        Logout
      </button>
      <section>
        <h2>Tenants</h2>
        <ul>{tenants.map((t: any) => <li key={t.id}>{t.email}</li>)}</ul>
      </section>
      <section>
        <h2>Add Tenant</h2>
        <form onSubmit={handleAddTenant}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border p-2 mr-2"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border p-2 mr-2"
          />
          <button type="submit" className="bg-blue-500 text-white p-2">
            Add Tenant
          </button>
        </form>
      </section>
    </div>
  );
}