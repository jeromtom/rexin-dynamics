'use client';

import Link from "next/link";
import { LegalShell } from "@/components/rx/LegalShell";

export default function BankDetailsClient() {
  return (
    <LegalShell
      eyebrow="Payments"
      title="Bank Transfer Details"
      intro="Use these details for NEFT, RTGS, or IMPS transfers. Please contact us after making the payment."
    >
      <section className="rx-legal-callout">
        <p>
          <strong>Bank Name:</strong> Federal Bank Limited
        </p>
        <p>
          <strong>Account Name:</strong> Rexin Dynamics Private Limited
        </p>
        <p>
          <strong>Account Number:</strong> <span className="rx-mono">10060200012427</span>
        </p>
        <p>
          <strong>IFSC Code:</strong> <span className="rx-mono">FDRL0001006</span>
        </p>
        <p>
          <strong>Important:</strong> After making the payment, please send the transaction details (transaction ID, amount, date) to{" "}
          <a href="mailto:contact@rexindynamics.com">contact@rexindynamics.com</a> or WhatsApp us at{" "}
          <a href="https://wa.me/918921588769">+91 89215 88769</a> so we can process your order.
        </p>
      </section>

      <p>
        <Link href="/#contact">Need help? Contact us</Link>
      </p>
    </LegalShell>
  );
}
