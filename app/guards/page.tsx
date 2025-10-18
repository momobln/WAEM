"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

type Guard = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: "ADMIN" | "USER";
};

const isRedirectPayload = (
  payload: unknown
): payload is { redirect?: string } =>
  Boolean(payload && typeof payload === "object" && "redirect" in payload);

const redirectFromPayload = (payload: unknown) => {
  if (isRedirectPayload(payload) && payload.redirect) {
    window.location.href = payload.redirect;
    return true;
  }
  return false;
};

const redirectFromResponse = (res: Response, payload: unknown) => {
  if (res.redirected) {
    window.location.href = res.url;
    return true;
  }
  return redirectFromPayload(payload);
};

const readJson = async (res: Response) => {
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return null;
};

export default function GuardsPage() {
  const { data: session } = useSession();
  const [guards, setGuards] = useState<Guard[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");


  const load = useCallback(async () => {
    const res = await fetch("/api/guards");
    
    const data = await readJson(res);
    if (redirectFromResponse(res, data)) return;
    if (res.ok && Array.isArray(data)) setGuards(data);
  }, []);

  const createGuard = async () => {

    if (!name || !email) {
      alert("Name and email are required.");
      return;
    }

    const res = await fetch("/api/guards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    });
    const data = await readJson(res);
    if (redirectFromResponse(res, data)) return;
    setName("");
    setEmail("");
    setPhone("");
    load();
  };

  const deleteGuard = async (id: string) => {

    const res = await fetch(`/api/guards/${id}`, { method: "DELETE" });
    const data = await readJson(res);
    if (redirectFromResponse(res, data)) return;
    load();
  };

  useEffect(() => {

    void load();
  }, [load]);

  return (
    <main style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Manage Guards</h2>
      <p style={{ color: "#64748b", fontSize: 14 }}>
        Signed in as {session?.user?.email} ({session?.user?.role})
      </p>

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