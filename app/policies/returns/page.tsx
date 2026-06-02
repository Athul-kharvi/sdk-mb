import { PolicyLayout } from '@/components/policy-layout'

export const metadata = { title: 'Return & Refund Policy — Vinayak Creation' }

export default function ReturnsPolicy() {
  return (
    <PolicyLayout
      badge="Policies"
      title="Return & Refund Policy"
      lastUpdated="April 2025"
      intro="Your satisfaction is our priority. We have a straightforward return and refund policy to make your experience worry-free."
      sections={[
        {
          heading: 'Return Window',
          body: 'You may request a return within 7 days of delivery. After 7 days, we are unable to accept returns or process refunds. The return window starts from the date the package is marked as delivered by our courier partner.',
        },
        {
          heading: 'Eligible Returns',
          body: (
            <div className="space-y-2">
              <p>We accept returns for the following reasons:</p>
              <ul className="mt-3 space-y-2 ml-4">
                {[
                  'Product received is defective or damaged',
                  'Wrong item delivered (different from what was ordered)',
                  'Significant quality issues not visible in product photos',
                ].map(r => (
                  <li key={r} className="flex gap-3">
                    <span className="text-rich-gold shrink-0">✓</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          ),
        },
        {
          heading: 'Non-Returnable Items',
          body: (
            <div className="space-y-2">
              <p>The following are not eligible for return:</p>
              <ul className="mt-3 space-y-2 ml-4">
                {[
                  'Items returned without original packaging or tags',
                  'Jewellery that has been worn, altered, or resized',
                  'Items damaged due to misuse or improper care',
                  'Orders where return is requested after 7 days of delivery',
                  'Items bought during special sales or promotions (marked as non-returnable)',
                ].map(r => (
                  <li key={r} className="flex gap-3">
                    <span className="text-red-400/70 shrink-0">✗</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          ),
        },
        {
          heading: 'How to Initiate a Return',
          body: (
            <div className="space-y-3">
              <p>To start a return, follow these steps:</p>
              <ol className="mt-3 space-y-3 ml-4">
                {[
                  'WhatsApp or email us within 7 days of delivery with your Order ID and reason for return.',
                  'Attach clear photos/video of the item showing the defect or issue.',
                  'Our team will review and respond within 24–48 hours with approval or rejection.',
                  'If approved, we will share the return shipping address. Pack the item securely in its original packaging.',
                  'Once we receive and inspect the item, refund will be processed within 5–7 business days.',
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-brandon text-xs text-rich-gold/60 shrink-0 w-4">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ),
        },
        {
          heading: 'Refund Method',
          body: 'Approved refunds are credited back to the original payment method (UPI, bank account, card, or wallet) within 5–7 business days after we receive and inspect the returned item. Bank processing time may add an additional 2–3 business days depending on your bank.',
        },
        {
          heading: 'Return Shipping',
          body: 'For defective or wrong items, Vinayak Creation will cover the return shipping cost. For other eligible returns, the customer is responsible for return shipping charges. We recommend using a trackable shipping service — we are not responsible for items lost in transit.',
        },
        {
          heading: 'Exchange Policy',
          body: 'We currently offer exchanges only for the same product in case of manufacturing defects. We do not offer size or design exchanges at this time. If you need a different product, please place a new order.',
        },
        {
          heading: 'Cancellation',
          body: 'Orders can be cancelled for a full refund within 2 hours of placing the order, before it has been dispatched. To cancel, WhatsApp or email us immediately with your Order ID. Once dispatched, cancellation is not possible — you may initiate a return after delivery.',
        },
      ]}
      relatedLinks={[
        { label: 'Shipping Policy', href: '/policies/shipping' },
        { label: 'Privacy Policy', href: '/policies/privacy' },
        { label: 'Terms of Service', href: '/policies/terms' },
      ]}
    />
  )
}
