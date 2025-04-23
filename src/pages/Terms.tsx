
import MainLayout from "@/components/layout/MainLayout";

export default function Terms() {
  return (
    <MainLayout>
      <div className="container py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">FAQ & Terms and Conditions</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Frequently Asked Questions</h2>
          <dl className="space-y-6">
            <div>
              <dt className="font-semibold">1. What products do you sell?</dt>
              <dd className="ml-4 text-gray-700">
                We specialize in IoT components, Arduino boards, sensors, modules, and electronics—offering genuine, high-quality products for makers and hobbyists.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">2. How long does shipping take?</dt>
              <dd className="ml-4 text-gray-700">
                Delivery usually takes 2-7 business days across India. Express and free shipping options are available on qualifying orders.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">3. Do you offer returns?</dt>
              <dd className="ml-4 text-gray-700">
                Yes, you may return products within 30 days if unused and in original packaging. Contact us at contact@pythronix.in for help.
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Terms and Conditions</h2>
          <ol className="list-decimal ml-6 text-gray-700 space-y-3">
            <li>
              <b>Payment</b>: We accept secure online payments through various gateways. Orders are confirmed upon successful payment.
            </li>
            <li>
              <b>Shipping</b>: All orders are processed within 1 business day. Delays may occur during peak seasons.
            </li>
            <li>
              <b>Returns & Refunds</b>: Items must be unused and returned within 30 days. Shipping charges are not refundable.
            </li>
            <li>
              <b>Contact</b>: Reach us for any disputes or queries at <a href="mailto:contact@pythronix.in" className="text-pythronix-blue underline">contact@pythronix.in</a>.
            </li>
            <li>
              <b>Agreement</b>: By using our website, you accept these terms and conditions.
            </li>
          </ol>
        </section>
      </div>
    </MainLayout>
  );
}
