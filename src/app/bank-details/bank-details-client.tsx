'use client';

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";

export default function BankDetailsClient() {
  const { resolvedTheme } = useTheme();
  
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

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="mb-8 sm:mb-10 space-y-2 sm:space-y-3">
          <p className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
            Payment Information
          </p>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight">
            Bank Transfer Details
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Use these details for NEFT, RTGS, or IMPS transfers. Please contact us after making the payment.
          </p>
        </div>

        <Card className="border border-border bg-card/80 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="space-y-5 sm:space-y-6">
            <div>
              <p className="mb-1 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                Bank Name
              </p>
              <p className="text-sm sm:text-base font-medium break-words">Federal Bank Limited</p>
            </div>

            <div>
              <p className="mb-1 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                Account Name
              </p>
              <p className="text-sm sm:text-base font-medium break-words">Rexin Dynamics Private Limited</p>
            </div>

            <div>
              <p className="mb-1 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                Account Number
              </p>
              <p className="text-sm sm:text-base font-medium font-mono break-all">10060200012427</p>
            </div>

            <div>
              <p className="mb-1 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                IFSC Code
              </p>
              <p className="text-sm sm:text-base font-medium font-mono break-all">FDRL0001006</p>
            </div>

            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-dashed border-border/70">
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
                <strong className="text-foreground">Important:</strong> After making the payment, please send the transaction details (transaction ID, amount, date) to{" "}
                <a
                  href="mailto:contact@rexindynamics.com"
                  className="underline-offset-4 hover:underline text-foreground break-all"
                >
                  contact@rexindynamics.com
                </a>{" "}
                or WhatsApp us at{" "}
                <a
                  href="https://wa.me/918921588769"
                  className="underline-offset-4 hover:underline text-foreground whitespace-nowrap"
                >
                  +91 89215 88769
                </a>
                {" "}so we can process your order.
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-6 sm:mt-8 text-center">
          <Link
            href="/#contact"
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
          >
            Need help? Contact us
          </Link>
        </div>
      </main>
    </div>
  );
}

