import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Privacy Policy - Rexin Dynamics",
  description: "Privacy Policy for Rexin Dynamics Platform",
};

export default function PrivacyPage() {
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
            Legal
          </p>
          <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">Privacy Policy</h1>
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
            <h2 className="text-base font-medium mb-2 text-foreground">Introduction</h2>
            <p>
              This Privacy Policy describes how Rexin Dynamics Private Limited and its affiliates (collectively &quot;Rexin Dynamics Private Limited, we, our, us&quot;) collect, use, share, protect or otherwise process your information/ personal data through our website https://rexindynamics.com (hereinafter referred to as Platform). Please note that you may be able to browse certain sections of the Platform without registering with us. We do not offer any product/service under this Platform outside India and your personal data will primarily be stored and processed in India. By visiting this Platform, providing your information or availing any product/service offered on the Platform, you expressly agree to be bound by the terms and conditions of this Privacy Policy, the Terms of Use and the applicable service/product terms and conditions, and agree to be governed by the laws of India including but not limited to the laws applicable to data protection and privacy. If you do not agree please do not use or access our Platform.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-2 text-foreground">Collection</h2>
            <p>
              We collect your personal data when you use our Platform, services or otherwise interact with us during the course of our relationship and related information provided from time to time. Some of the information that we may collect includes but is not limited to personal data / information provided to us during sign-up/registering or using our Platform such as name, date of birth, address, telephone/mobile number, email ID and/or any such information shared as proof of identity or address. Some of the sensitive personal data may be collected with your consent, such as your bank account or credit or debit card or other payment instrument information or biometric information such as your facial features or physiological information (in order to enable use of certain features when opted for, available on the Platform) etc all of the above being in accordance with applicable law(s). You always have the option to not provide information, by choosing not to use a particular service or feature on the Platform. We may track your behaviour, preferences, and other information that you choose to provide on our Platform. This information is compiled and analysed on an aggregated basis. We will also collect your information related to your transactions on Platform and such third-party business partner platforms. When such a third-party business partner collects your personal data directly from you, you will be governed by their privacy policies. We shall not be responsible for the third-party business partner&apos;s privacy practices or the content of their privacy policies, and we request you to read their privacy policies prior to disclosing any information. If you receive an email, a call from a person/association claiming to be Rexin Dynamics Private Limited seeking any personal data like debit/credit card PIN, net-banking or mobile banking password, we request you to never provide such information. If you have already revealed such information, report it immediately to an appropriate law enforcement agency.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-2 text-foreground">Usage</h2>
            <p>
              We use personal data to provide the services you request. To the extent we use your personal data to market to you, we will provide you the ability to opt-out of such uses. We use your personal data to assist sellers and business partners in handling and fulfilling orders; enhancing customer experience; to resolve disputes; troubleshoot problems; inform you about online and offline offers, products, services, and updates; customise your experience; detect and protect us against error, fraud and other criminal activity; enforce our terms and conditions; conduct marketing research, analysis and surveys; and as otherwise described to you at the time of collection of information. You understand that your access to these products/services may be affected in the event permission is not provided to us.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-2 text-foreground">Sharing</h2>
            <p>
              We may share your personal data internally within our group entities, our other corporate entities, and affiliates to provide you access to the services and products offered by them. These entities and affiliates may market to you as a result of such sharing unless you explicitly opt-out. We may disclose personal data to third parties such as sellers, business partners, third party service providers including logistics partners, prepaid payment instrument issuers, third-party reward programs and other payment opted by you. These disclosure may be required for us to provide you access to our services and products offered to you, to comply with our legal obligations, to enforce our user agreement, to facilitate our marketing and advertising activities, to prevent, detect, mitigate, and investigate fraudulent or illegal activities related to our services. We may disclose personal and sensitive personal data to government agencies or other authorised law enforcement agencies if required to do so by law or in the good faith belief that such disclosure is reasonably necessary to respond to subpoenas, court orders, or other legal process. We may disclose personal data to law enforcement offices, third party rights owners, or others in the good faith belief that such disclosure is reasonably necessary to: enforce our Terms of Use or Privacy Policy; respond to claims that an advertisement, posting or other content violates the rights of a third party; or protect the rights, property or personal safety of our users or the general public.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-2 text-foreground">Security Precautions</h2>
            <p>
              To protect your personal data from unauthorised access or disclosure, loss or misuse we adopt reasonable security practices and procedures. Once your information is in our possession or whenever you access your account information, we adhere to our security guidelines to protect it against unauthorised access and offer the use of a secure server. However, the transmission of information is not completely secure for reasons beyond our control. By using the Platform, the users accept the security implications of data transmission over the internet and the World Wide Web which cannot always be guaranteed as completely secure, and therefore, there would always remain certain inherent risks regarding use of the Platform. Users are responsible for ensuring the protection of login and password records for their account.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-2 text-foreground">Data Deletion and Retention</h2>
            <p>
              You have an option to delete your account by visiting your profile and settings on our Platform, this action would result in you losing all information related to your account. You may also write to us at the contact information provided below to assist you with these requests. We may in event of any pending grievance, claims, pending shipments or any other services we may refuse or delay deletion of the account. Once the account is deleted, you will lose access to the account. We retain your personal data information for a period no longer than is required for the purpose for which it was collected or as required under any applicable law. However, we may retain data related to you if we believe it may be necessary to prevent fraud or future abuse or for other legitimate purposes. We may continue to retain your data in anonymised form for analytical and research purposes.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-2 text-foreground">Your Rights</h2>
            <p>
              You may access, rectify, and update your personal data directly through the functionalities provided on the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-2 text-foreground">Consent</h2>
            <p>
              By visiting our Platform or by providing your information, you consent to the collection, use, storage, disclosure and otherwise processing of your information on the Platform in accordance with this Privacy Policy. If you disclose to us any personal data relating to other people, you represent that you have the authority to do so and permit us to use the information in accordance with this Privacy Policy. You, while providing your personal data over the Platform or any partner platforms or establishments, consent to us (including our other corporate entities, affiliates, lending partners, technology partners, marketing channels, business partners and other third parties) to contact you through SMS, instant messaging apps, call and/or e-mail for the purposes specified in this Privacy Policy. You have an option to withdraw your consent that you have already provided by writing to the Grievance Officer at the contact information provided below. Please mention &apos;Withdrawal of consent for processing personal data&apos; in your subject line of your communication. We may verify such requests before acting on our request. However, please note that your withdrawal of consent will not be retrospective and will be in accordance with the Terms of Use, this Privacy Policy, and applicable laws. In the event you withdraw consent given to us under this Privacy Policy, we reserve the right to restrict or deny the provision of our services for which we consider such information to be necessary.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-2 text-foreground">Changes to this Privacy Policy</h2>
            <p>
              Please check our Privacy Policy periodically for changes. We may update this Privacy Policy to reflect changes to our information practices. We may alert / notify you about the significant changes to the Privacy Policy, in the manner as may be required under applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-2 text-foreground">Grievance Officer</h2>
            <p>
              For any concerns or communications relating to this Privacy Policy, please contact us using the contact information provided on this website.
            </p>
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
                <strong>Time:</strong> Monday - Friday (9:00 - 18:00)
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


