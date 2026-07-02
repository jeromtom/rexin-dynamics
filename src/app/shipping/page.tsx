import type { Metadata } from "next";
import { LegalShell } from "@/components/rx/LegalShell";

export const metadata: Metadata = {
  alternates: { canonical: "/shipping/" },
  title: "Shipping Policy - Rexin Dynamics",
  description: "Shipping Policy for Rexin Dynamics Platform",
};

export default function ShippingPage() {
  return (
    <LegalShell
      title="Shipping Policy"
      intro="Rexin Dynamics Private Limited – Registered Address: KODINJIYIL, Palakuzha, Muvattupuzha, Ernakulam, Kerala 686662."
    >
      <p className="rx-legal-updated" suppressHydrationWarning>
        Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <section>
        <h2>Shipping Policy</h2>
        <p>
          We mainly provide services. If anything is to be shipped, it will be via third party vendors.
        </p>
      </section>

      <section className="rx-legal-callout">
        <h2 style={{ margin: 0 }}>Contact Information</h2>
        <p>
          <strong>Business Name:</strong> Rexin Dynamics Private Limited
        </p>
        <p>
          <strong>Email:</strong> <a href="mailto:contact@rexindynamics.com">contact@rexindynamics.com</a>
        </p>
        <p>
          <strong>Mobile:</strong> +91 89215 88769
        </p>
        <p>
          <strong>Address:</strong> KODINJIYIL, Palakuzha, Muvattupuzha, Ernakulam, Kerala 686662, India
        </p>
      </section>
    </LegalShell>
  );
}
