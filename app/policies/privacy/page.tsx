import { PolicyLayout } from '@/components/policy-layout'

export const metadata = { title: 'Privacy Policy — Vinayaka Creation' }

export default function PrivacyPolicy() {
  return (
    <PolicyLayout
      badge="Policies"
      title="Privacy Policy"
      lastUpdated="April 2025"
      intro="Vinayaka Creation ('we', 'our', 'us') is committed to protecting your personal information. This policy explains what data we collect, how we use it, and your rights."
      sections={[
        {
          heading: 'Information We Collect',
          body: (
            <div className="space-y-3">
              <p>We collect the following types of information:</p>
              <ul className="mt-3 space-y-2 ml-4">
                {[
                  ['Account information', 'Name, email address, and password when you create an account.'],
                  ['Order information', 'Delivery address, phone number, and order history.'],
                  ['Payment information', 'Payments are processed securely by Razorpay. We do not store your card details or UPI credentials.'],
                  ['Usage data', 'Pages visited, device type, browser, and IP address — collected via analytics to improve our store.'],
                  ['Communications', 'Messages you send us via WhatsApp or email.'],
                ].map(([label, desc]) => (
                  <li key={label} className="flex gap-3">
                    <span className="text-rich-gold shrink-0">—</span>
                    <span><span className="text-ivory">{label}:</span> {desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ),
        },
        {
          heading: 'How We Use Your Information',
          body: (
            <ul className="space-y-2 ml-4">
              {[
                'Process and fulfil your orders',
                'Send order confirmation, shipping updates, and delivery notifications',
                'Respond to customer support queries',
                'Improve our products, website, and customer experience',
                'Send promotional offers and new arrivals (only if you opt in)',
                'Comply with legal and regulatory obligations',
              ].map(u => (
                <li key={u} className="flex gap-3">
                  <span className="text-rich-gold shrink-0">—</span>
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          ),
        },
        {
          heading: 'Data Sharing',
          body: 'We do not sell your personal data to third parties. We share data only with: (1) Razorpay for payment processing, (2) courier partners to fulfil deliveries, and (3) cloud infrastructure providers (Supabase) that host our platform under strict data protection agreements.',
        },
        {
          heading: 'Cookies',
          body: 'We use session cookies to keep you logged in and anonymous analytics cookies to understand how visitors use our store. You can disable cookies in your browser settings, but this may affect checkout functionality.',
        },
        {
          heading: 'Data Retention',
          body: 'We retain your account and order data for as long as your account is active or as required for legal and financial compliance (typically 7 years for transaction records under Indian GST law). You may request deletion of your account at any time.',
        },
        {
          heading: 'Your Rights',
          body: (
            <ul className="space-y-2 ml-4">
              {[
                'Access the personal data we hold about you',
                'Request correction of inaccurate data',
                'Request deletion of your account and data',
                'Opt out of marketing communications at any time',
                'Lodge a complaint with the relevant data protection authority',
              ].map(r => (
                <li key={r} className="flex gap-3">
                  <span className="text-rich-gold shrink-0">✓</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          ),
        },
        {
          heading: 'Data Security',
          body: 'We use industry-standard security measures including HTTPS encryption, secure Supabase row-level security, and Razorpay\'s PCI-DSS compliant payment infrastructure. However, no internet transmission is 100% secure — please protect your account credentials.',
        },
        {
          heading: 'Children\'s Privacy',
          body: 'Our store is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us data, please contact us immediately and we will delete it.',
        },
        {
          heading: 'Changes to This Policy',
          body: 'We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top. Continued use of our store after changes constitutes acceptance of the updated policy.',
        },
        {
          heading: 'Contact',
          body: 'For privacy-related requests or questions, contact us at hello@sridevik.in or via WhatsApp. We will respond within 48 business hours.',
        },
      ]}
      relatedLinks={[
        { label: 'Terms of Service', href: '/policies/terms' },
        { label: 'Return & Refund Policy', href: '/policies/returns' },
        { label: 'Shipping Policy', href: '/policies/shipping' },
      ]}
    />
  )
}
