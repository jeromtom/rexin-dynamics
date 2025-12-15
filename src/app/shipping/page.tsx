import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Shipping Policy - Rexin Dynamics",
  description: "Shipping Policy for Rexin Dynamics Platform",
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/70 backdrop-blur-sm bg-background/75">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              <span className="font-bold">REXIN</span> <span className="font-normal">Dynamics</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-10 space-y-3">
          <p className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
            Policy
          </p>
          <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
            Shipping Policy
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Rexin Dynamics Private Limited – Registered Address: KODINJIYIL, Palakuzha, Muvattupuzha,
            Ernakulam, Kerala 686662.
          </p>
        </div>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p className="text-xs text-muted-foreground/80 italic">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <p>
              The orders for the user are shipped through registered domestic courier companies and/or speed post only. Orders are shipped within 10 days from the date of the order and/or payment or as per the delivery date agreed at the time of order confirmation and delivering of the shipment, subject to courier company / post office norms. Platform Owner shall not be liable for any delay in delivery by the courier company / postal authority. Delivery of all orders will be made to the address provided by the buyer at the time of purchase. Delivery of our services will be confirmed on your email ID as specified at the time of registration. If there are any shipping cost(s) levied by the seller or the Platform Owner (as the case be), the same is not refundable.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-2 text-foreground">Contact Information</h2>
            <div className="mt-2 space-y-1 text-sm">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:contact@rexindynamics.com"
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  contact@rexindynamics.com
                </a>
              </p>
              <p>
                <strong>Phone:</strong> +91 89215 88769
              </p>
              <p>
                <strong>Address:</strong> KODINJIYIL, Palakuzha, Muvattupuzha, Ernakulam, Kerala 686662, India
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border/70">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}

