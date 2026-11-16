import type { Metadata } from "next";
import { LegalShell } from "@/components/rx/LegalShell";

export const metadata: Metadata = {
  alternates: { canonical: "/1aim/" },
  title: "1AIM: Audit Intelligence & Monitoring for Co-operative Banks - Rexin Dynamics",
  description:
    "1AIM is a risk-based internal audit (RBIA) and offsite monitoring platform built for India's co-operative banks: State Co-operative Banks, DCCBs and PACS.",
  openGraph: {
    title: "1AIM: Audit Intelligence & Monitoring for Co-operative Banks",
    description: "Risk-based internal audit and offsite monitoring for State Co-operative Banks, DCCBs and PACS. English and Malayalam.",
    url: "https://rexindynamics.com/1aim/",
    images: ["/products/1aim/executive.jpg"],
  },
};

/* Screenshot with caption; every image shows synthetic demonstration data. */
function Shot({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure style={{ margin: "0.4rem 0 0" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: "100%", height: "auto", display: "block", border: "1px solid var(--rx-border)", borderRadius: 10 }}
      />
      <figcaption style={{ marginTop: 8, fontSize: 13, color: "var(--rx-text-muted)" }}>{caption}</figcaption>
    </figure>
  );
}

export default function OneAimPage() {
  return (
    <LegalShell
      eyebrow="Product"
      title="1AIM: Audit Intelligence & Monitoring for Co-operative Banks"
      intro="A risk-based internal audit (RBIA) and offsite monitoring platform built for India's co-operative banking system: State Co-operative Banks, District Central Co-operative Banks and PACS. Developed by Rexin Dynamics, Kochi."
    >
      <figure id="video" style={{ margin: "0.4rem 0 0" }}>
        <video
          src="/products/1aim/1aim-product-video.mp4"
          poster="/products/1aim/1aim-video-poster.jpg"
          controls
          muted
          playsInline
          preload="metadata"
          style={{ width: "100%", height: "auto", display: "block", border: "1px solid var(--rx-border)", borderRadius: 10, background: "#000" }}
        />
        <figcaption style={{ marginTop: 8, fontSize: 13, color: "var(--rx-text-muted)" }}>
          A 90-second walkthrough: executive view, risk matrix, branch rating, fieldwork, Malayalam branch compliance, offsite monitoring, governed AI and the audit trail. Synthetic demonstration data.
        </figcaption>
      </figure>

      <Shot
        src="/products/1aim/executive.jpg"
        alt="1AIM executive risk overview with the RBIA lifecycle from audit universe to monitoring"
        caption="Executive view: the whole RBIA lifecycle, from audit universe to monitoring, on one screen. Synthetic demonstration data."
      />

      <section>
        <h2>Why co-operative banks need it</h2>
        <p>
          India&apos;s short-term co-operative credit structure has 34 State Co-operative Banks, about 350 DCCBs with nearly 14,000 branches, and over one lakh PACS (RBI and NABARD, March 2025). RBI has proposed making risk-based internal audit mandatory for larger rural co-operative banks from April 2027, yet much of this audit work still runs on spreadsheets, paper registers and email.
        </p>
        <p>
          1AIM gives the inspection department one governed system for the full audit cycle, designed around how co-operative banks are actually structured and supervised.
        </p>
      </section>

      <section>
        <h2>What it does</h2>
        <ul>
          <li><strong>RBIA as RBI prescribes it.</strong> Business risk and control risk combine in the RBI 2002 risk matrix, with a five-level rating, trend, audit frequency and a Board-approved Risk Based Audit Plan. Every score is explainable and reproducible.</li>
          <li><strong>The full three-tier network.</strong> Branches, CPCs, Regional Offices, HO departments, PACS and other societies, with PACS inspection and Regional Operations Manager inspection as first-class workflows.</li>
          <li><strong>Fieldwork that works offline.</strong> Checklists, sampling and evidence capture for auditors, with irregularity memos generated from the same record.</li>
          <li><strong>Branch compliance that cannot be gamed.</strong> Auditees reply online with evidence. Generic replies such as &quot;Noted&quot; are blocked, and controlling offices accept or reject with comments before closure.</li>
          <li><strong>Offsite monitoring (OMS).</strong> Rule-based exceptions from core banking data, routed to branch, RO and HO with ageing and escalation.</li>
          <li><strong>Malayalam and English.</strong> One switch changes every screen, letter and memo.</li>
          <li><strong>Governed AI.</strong> AI finds recurring themes across reports and drafts summaries, always with sources and human approval, mapped to RBI&apos;s FREE-AI framework. Ratings stay deterministic.</li>
          <li><strong>Evidence-grade audit trail.</strong> Tamper-evident, hash-chained logs of every action, plus rating letters and Audit Committee notes.</li>
        </ul>
      </section>

      <Shot
        src="/products/1aim/matrix.jpg"
        alt="1AIM district risk heatmap across an 823-branch synthetic network with audit coverage against suggested frequency"
        caption="Network risk heatmap and audit coverage against the risk-based frequency, across an 823-branch synthetic network."
      />

      <Shot
        src="/products/1aim/compliance-ml.jpg"
        alt="1AIM branch compliance screen in Malayalam showing a branch head replying to audit remarks"
        caption="Branch compliance in Malayalam: the branch head replies to each remark with evidence."
      />

      <Shot
        src="/products/1aim/rating.jpg"
        alt="1AIM branch risk rating with ORM and CRM scores and a Head Office override under maker-checker"
        caption="Branch rating: ORM and CRM scores, computed level, and a Head Office override under maker-checker with a recorded reason."
      />

      <section>
        <h2>Integration and deployment</h2>
        <ul>
          <li>Designed to integrate with core banking (Finacle and others), loan origination, early warning and document management systems through a governed interface layer: validate, commit atomically, then reconcile counts and totals.</li>
          <li>Deployable in the bank&apos;s own data centre and DR site, or on a MeitY-empanelled Indian cloud.</li>
          <li>Open-source stack with no proprietary platform licences; six server-enforced roles from Super User to Branch Head.</li>
        </ul>
      </section>

      <Shot
        src="/products/1aim/oms.jpg"
        alt="1AIM offsite monitoring console with rule-based exceptions and ageing"
        caption="Offsite monitoring: rule-based exceptions with owner, ageing and escalation."
      />

      <section>
        <h2>Status</h2>
        <p>
          1AIM runs today as a live proof of concept on synthetic data, modelled on a State Co-operative Bank with an 823-branch network. No real bank, customer or staff data is used. Demonstrations are available on request.
        </p>
      </section>

      <section className="rx-legal-callout">
        <h2 style={{ marginTop: 0 }}>Talk to us</h2>
        <p>
          For a demonstration or a discussion with your inspection department, write to{" "}
          <a href="mailto:contact@rexindynamics.com?subject=1AIM%20demonstration">contact@rexindynamics.com</a>.
        </p>
      </section>
    </LegalShell>
  );
}
