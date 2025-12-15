import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Return Policy - Rexin Dynamics",
  description: "Return Policy for Rexin Dynamics Platform",
};

export default function ReturnPage() {
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
            Return Policy
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
            <h2 className="text-base font-medium mb-2 text-foreground">Return Policy</h2>
            <p>
              We offer refund / exchange within first 7 days from the date of your purchase. If 7 days have passed since your purchase, you will not be offered a return, exchange or refund of any kind. In order to become eligible for a return or an exchange, (i) the purchased item should be unused and in the same condition as you received it, (ii) the item must have original packaging, (iii) if the item that you purchased on a sale, then the item may not be eligible for a return / exchange. Further, only such items are replaced by us (based on an exchange request), if such items are found defective or damaged.
            </p>
          </section>

          <section>
            <p>
              You agree that there may be a certain category of products / items that are exempted from returns or refunds. Such categories of the products would be identified to you at the item of purchase. For exchange / return accepted request(s) (as applicable), once your returned product / item is received and inspected by us, we will send you an email to notify you about receipt of the returned / exchanged product. Further. If the same has been approved after the quality check at our end, your request (i.e. return / exchange) will be processed in accordance with our policies.
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

