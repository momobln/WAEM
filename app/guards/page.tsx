"use client";
import { useState, useEffect } from "react";

type Guard = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: "ADMIN" | "USER";
};

export default function GuardsPage() {
  const [guards, setGuards] = useState<Guard[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const load = async () => {
    const res = await fetch("/api/guards");
    if (res.ok) setGuards(await res.json());
  };

  const createGuard = async () => {
    await fetch("/api/guards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    });
    setName("");
    setEmail("");
    setPhone("");
    load();
  };

  const deleteGuard = async (id: string) => {
    await fetch(`/api/guards/${id}`, { method: "DELETE" });
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Manage Guards</h2>

      <div style={{ marginBottom: 20 }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        <button onClick={createGuard}>Add Guard</button>
      </div>

      <ul>
        {guards.map(g => (
          <li key={g.id}>
            {g.name} ({g.email}) - {g.role}
            <button onClick={() => deleteGuard(g.id)} style={{ marginLeft: 10 }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
