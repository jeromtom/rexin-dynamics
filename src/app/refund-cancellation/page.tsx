import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy - Rexin Dynamics",
  description: "Refund and Cancellation Policy for Rexin Dynamics Platform",
};

export default function RefundCancellationPage() {
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
            Refund and Cancellation Policy
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

          <p>
            This refund and cancellation policy outlines how you can cancel or seek a refund for a product / service that you have purchased through the Platform. Under this policy:
          </p>

          <section>
            <p>
              Cancellations will only be considered if the request is made 2 days of placing the order. However, cancellation requests may not be entertained if the orders have been communicated to such sellers / merchant(s) listed on the Platform and they have initiated the process of shipping them, or the product is out for delivery. In such an event, you may choose to reject the product at the doorstep.
            </p>
          </section>

          <section>
            <p>
              Rexin Dynamics Private Limited does not accept cancellation requests for perishable items like flowers, eatables, etc. However, the refund / replacement can be made if the user establishes that the quality of the product delivered is not good.
            </p>
          </section>

          <section>
            <p>
              In case of receipt of damaged or defective items, please report to our customer service team. The request would be entertained once the seller/ merchant listed on the Platform, has checked and determined the same at its own end. This should be reported within 2 days of receipt of products. In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 2 days of receiving the product. The customer service team after looking into your complaint will take an appropriate decision.
            </p>
          </section>

          <section>
            <p>
              In case of complaints regarding the products that come with a warranty from the manufacturers, please refer the issue to them.
            </p>
          </section>

          <section>
            <p>
              In case of any refunds approved by Rexin Dynamics Private Limited, it will take 4 days for the refund to be processed to you.
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

