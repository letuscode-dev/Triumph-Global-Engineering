import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/PageHero";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE.name} — how we collect, use, and protect your personal information.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle="How we handle your personal information when you use our website and contact forms."
        breadcrumb={[{ label: "Privacy Policy" }]}
      />

      <section className="section">
        <div className="container-page prose prose-slate max-w-3xl prose-headings:font-display prose-a:text-brand-600">
          <p className="lead text-slate-600">
            Last updated: June 2026. {SITE.name} (&quot;we&quot;, &quot;us&quot;) respects your
            privacy. This policy explains what we collect, why we collect it, and your choices.
          </p>

          <h2>Information we collect</h2>
          <ul>
            <li>
              <strong>Quote &amp; contact forms:</strong> name, phone, email, company, location,
              service interest, budget, and your message.
            </li>
            <li>
              <strong>Analytics (optional):</strong> if you accept cookies, Google Analytics may
              collect anonymised usage data (pages visited, device type, approximate location).
            </li>
            <li>
              <strong>Technical data:</strong> IP address and browser type for security (rate
              limiting, spam prevention).
            </li>
          </ul>

          <h2>How we use your information</h2>
          <ul>
            <li>To respond to your enquiry and provide quotations or services.</li>
            <li>To send internal email notifications to our team when you submit a form.</li>
            <li>To improve our website (only with your consent for analytics cookies).</li>
            <li>To protect our site from abuse and spam.</li>
          </ul>

          <h2>Where data is stored</h2>
          <p>
            Form submissions are stored securely in our database (Supabase) and may be emailed to
            our team via Resend. Data is processed to serve customers in Zimbabwe and may be stored
            on servers outside Zimbabwe depending on our service providers.
          </p>

          <h2>Cookies</h2>
          <p>
            We use essential cookies for admin login sessions. Analytics cookies (Google Analytics)
            are only loaded after you click <strong>Accept</strong> on the cookie banner. You may
            decline analytics cookies and still use the site.
          </p>

          <h2>Sharing your data</h2>
          <p>
            We do not sell your personal information. We share data only with service providers
            needed to operate the website (hosting, database, email delivery, analytics when
            consented).
          </p>

          <h2>Your rights</h2>
          <p>
            You may request access, correction, or deletion of your personal data by contacting us
            at{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or {SITE.phones[0]}.
          </p>

          <h2>Contact</h2>
          <p>
            {SITE.name}
            <br />
            {SITE.address}
            <br />
            Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
        </div>
      </section>
    </>
  );
}
