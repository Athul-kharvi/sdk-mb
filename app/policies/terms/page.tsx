import { PolicyLayout } from '@/components/policy-layout'

export const metadata = { title: 'Terms of Service — Vinayak Creation' }

export default function TermsOfService() {
  return (
    <PolicyLayout
      badge="Policies"
      title="Terms of Service"
      lastUpdated="April 2025"
      intro="By accessing or using the Vinayak Creation website or placing an order, you agree to be bound by these Terms of Service. Please read them carefully."
      sections={[
        {
          heading: 'Acceptance of Terms',
          body: 'By using this website or purchasing from Vinayak Creation, you confirm that you are at least 18 years of age (or have parental consent), have read and understood these terms, and agree to be legally bound by them.',
        },
        {
          heading: 'Products & Pricing',
          body: 'We reserve the right to modify product descriptions, prices, and availability at any time without prior notice. All prices are in Indian Rupees (₹) and inclusive of applicable taxes unless stated otherwise. Product images are for illustrative purposes — minor colour variations may occur due to screen calibration.',
        },
        {
          heading: 'Orders & Payment',
          body: 'An order confirmation does not constitute acceptance of your order. We reserve the right to cancel orders in the event of stock unavailability, pricing errors, or suspected fraud. Payment is processed securely through Razorpay. By placing an order you authorise the charge of the full order amount.',
        },
        {
          heading: 'Account Responsibility',
          body: 'You are responsible for maintaining the confidentiality of your account credentials. You are liable for all activities that occur under your account. Notify us immediately at hello@sridevik.in if you suspect unauthorised access.',
        },
        {
          heading: 'Intellectual Property',
          body: 'All content on this website — including images, text, logos, design, and product photos — is the property of Vinayak Creation and is protected by copyright law. You may not reproduce, distribute, or use our content without prior written permission.',
        },
        {
          heading: 'Product Care Disclaimer',
          body: 'Our jewellery requires proper care to maintain its finish. We provide care instructions with each order. Damage caused by improper care, exposure to chemicals (perfumes, cleaning agents), or physical impact is not covered under our return policy.',
        },
        {
          heading: 'Limitation of Liability',
          body: 'Vinayak Creation\'s total liability for any claim arising from your use of our store is limited to the amount you paid for the specific order in question. We are not liable for indirect, incidental, or consequential damages including loss of profits, data, or goodwill.',
        },
        {
          heading: 'Prohibited Uses',
          body: (
            <div className="space-y-2">
              <p>You agree not to:</p>
              <ul className="mt-3 space-y-2 ml-4">
                {[
                  'Use the website for any unlawful purpose',
                  'Place fraudulent or malicious orders',
                  'Attempt to gain unauthorised access to our systems',
                  'Scrape, crawl, or data-mine our website without permission',
                  'Impersonate another person or entity',
                ].map(p => (
                  <li key={p} className="flex gap-3">
                    <span className="text-red-400/70 shrink-0">✗</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ),
        },
        {
          heading: 'Governing Law',
          body: 'These terms are governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of our store shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.',
        },
        {
          heading: 'Changes to Terms',
          body: 'We may update these Terms of Service at any time. Changes are effective immediately upon posting. Continued use of our website after changes constitutes your acceptance of the revised terms. We encourage you to review this page periodically.',
        },
        {
          heading: 'Contact',
          body: 'For questions about these Terms, contact us at hello@sridevik.in or via WhatsApp. We will respond within 48 business hours.',
        },
      ]}
      relatedLinks={[
        { label: 'Return & Refund Policy', href: '/policies/returns' },
        { label: 'Shipping Policy', href: '/policies/shipping' },
        { label: 'Privacy Policy', href: '/policies/privacy' },
      ]}
    />
  )
}
