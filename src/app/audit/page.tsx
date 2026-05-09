import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuditPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1.5rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>
        <span className="gradient-text">Spend Audit Form</span>
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
        Coming Day 1 — Full multi-tool spend input form
      </p>
      <Link href="/" className="btn-secondary">
        <ArrowLeft size={16} />
        Back to Home
      </Link>
    </div>
  );
}
