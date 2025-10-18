"use client";
import { signOut, useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#f8fafc",
        color: "#0f172a",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px 60px",
          borderRadius: "16px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1rem" }}>
          WORK TIME
        </h1>

        {session ? (
          <>
            <p style={{ marginBottom: "20px", fontSize: "1rem" }}>
              WELCOME:{" "}
              <span style={{ fontWeight: "600" }}>{session.user?.email}</span>
            </p>

            <button
              onClick={() => signOut()}
              style={{
                backgroundColor: "#2563eb",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
                marginBottom: "2rem",
              }}
            >
              Sign out
            </button>

            <div style={{ textAlign: "left" }}>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "0.75rem",
                  color: "#1e293b",
                }}
              >
                Sections
              </h2>

              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <a
                    href="/guards"
                    style={{
                      color: "#2563eb",
                      textDecoration: "none",
                      fontWeight: "500",
                    }}
                  >
                    Manage Guards
                  </a>
                </li>
                <li>
                  <a
                    href="/shifts"
                    style={{
                      color: "#2563eb",
                      textDecoration: "none",
                      fontWeight: "500",
                    }}
                  >
                    Manage Shifts
                  </a>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </main>
  );
}
