import type { Metadata } from "next";
import BankDetailsClient from "./bank-details-client";

export const metadata: Metadata = {
  title: "Bank Transfer Details - Rexin Dynamics",
  description: "Bank account details for NEFT/RTGS transfers to Rexin Dynamics Private Limited",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function BankDetailsPage() {
  return <BankDetailsClient />;
}
