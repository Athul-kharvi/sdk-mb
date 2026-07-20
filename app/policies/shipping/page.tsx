import { PolicyLayout } from '@/components/policy-layout'

export const metadata = { title: 'Shipping Policy — Vinayak Creation' }

export default function ShippingPolicy() {
  return (
    <PolicyLayout
      badge="Policies"
      title="Shipping Policy"
      lastUpdated="April 2025"
      intro="We want your jewellery to reach you safely and on time. Please read our shipping policy carefully before placing your order."
      sections={[
        {
          heading: 'Processing Time',
          body: 'All orders are processed within 1–2 business days after payment confirmation. Orders placed on weekends or public holidays are processed the next business day. You will receive an order confirmation email as soon as your order is accepted.',
        },
        {
          heading: 'Delivery Timeline',
          body: (
            <div className="space-y-2">
              <p>Standard delivery timelines from dispatch date:</p>
              <ul className="mt-3 space-y-2 ml-4">
                {[
                  ['Metro cities (Mumbai, Delhi, Bengaluru, Chennai, Kolkata, Hyderabad)', '2–3 business days'],
                  ['Tier 2 & Tier 3 cities', '3–5 business days'],
                  ['Remote / rural areas', '5–7 business days'],
                ].map(([region, time]) => (
                  <li key={region} className="flex gap-3">
                    <span className="text-rich-gold shrink-0">—</span>
                    <span><span className="text-ivory">{region}:</span> {time}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-taupe/70">Delivery timelines are estimates and may be affected by carrier delays, strikes, natural events, or government restrictions.</p>
            </div>
          ),
        },
        {
          heading: 'Shipping Charges',
          body: 'We offer free shipping on all orders above ₹599 across India. No hidden charges will be added at checkout.',
        },
        {
          heading: 'Order Tracking',
          body: 'Once your order is dispatched, you will receive a tracking number via SMS and email. You can use this tracking number on the courier partner\'s website to track your shipment in real time.',
        },
        {
          heading: 'Packaging',
          body: 'All jewellery is packed in our signature gift-ready boxes with protective cushioning to ensure your items arrive in perfect condition. Packaging is tamper-evident and sealed for safety.',
        },
        {
          heading: 'Address Accuracy',
          body: 'Please ensure your delivery address is complete and accurate at checkout — including flat/house number, street name, landmark, city, state, and PIN code. Vinayak Creation is not responsible for delays or failed deliveries caused by an incorrect or incomplete address.',
        },
        {
          heading: 'Failed Delivery Attempts',
          body: 'If delivery fails after 2–3 attempts due to unavailability or incorrect address, the package will be returned to us. In such cases, please contact us within 7 days and we will re-ship at no extra charge (subject to address verification).',
        },
      ]}
      relatedLinks={[
        { label: 'Return & Refund Policy', href: '/policies/returns' },
        { label: 'Privacy Policy', href: '/policies/privacy' },
        { label: 'Terms of Service', href: '/policies/terms' },
      ]}
    />
  )
}
