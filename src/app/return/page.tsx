import type { Metadata } from "next";
import { LegalShell } from "@/components/rx/LegalShell";

export const metadata: Metadata = {
  alternates: { canonical: "/return/" },
  title: "Return Policy - Rexin Dynamics",
  description: "Return Policy for Rexin Dynamics Platform",
};

export default function ReturnPage() {
  return (
    <LegalShell
      title="Return Policy"
      intro="Rexin Dynamics Private Limited – Company Address: First Floor, Integrated Startup Complex, Kerala Startup Mission, Kerala Technology Innovation Zone, Kinfra Hi-Tech Park, HMT Colony P.O., Kalamassery, Kochi, Kerala 683503."
    >
      <p className="rx-legal-updated" suppressHydrationWarning>
        Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <section>
        <h2>Return Policy</h2>
        <p>
          Refunds will be processed within 5-7 working days in the original payment mode.
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
          <strong>Address:</strong> First Floor, Integrated Startup Complex, Kerala Startup Mission, Kerala Technology Innovation Zone, Kinfra Hi-Tech Park, HMT Colony P.O., Kalamassery, Kochi, Kerala 683503, India
        </p>
      </section>
    </LegalShell>
  );
}
