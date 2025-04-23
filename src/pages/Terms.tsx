
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Terms() {
  return (
    <MainLayout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8 text-center font-heading">FAQ & Terms</h1>
        
        <Tabs defaultValue="faq" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
            <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq" className="mt-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How long does shipping take?</AccordionTrigger>
                <AccordionContent>
                  Shipping typically takes 3-5 business days within India. For international orders, 
                  please allow 7-14 business days for delivery. You will receive a tracking number 
                  once your order has been dispatched.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                <AccordionContent>
                  We accept credit cards (Visa, MasterCard, American Express), debit cards, UPI, 
                  net banking, and popular digital wallets including PayTM, Google Pay, and PhonePe.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>What is your return policy?</AccordionTrigger>
                <AccordionContent>
                  We offer a 30-day return policy for most products. Items must be unused and in their 
                  original packaging. Some electronic components and sensors may have specific return 
                  conditions. Please contact our customer service for details.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Do you offer technical support for products?</AccordionTrigger>
                <AccordionContent>
                  Yes, we provide technical support for all our products. You can reach out to our 
                  support team via email at support@pythronix.in or by calling our customer service 
                  number. We also have detailed documentation and tutorials on our website.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>Do you ship internationally?</AccordionTrigger>
                <AccordionContent>
                  Yes, we ship to most countries worldwide. International shipping rates and delivery 
                  times vary based on location. Please note that customers may be responsible for import 
                  duties and taxes imposed by their country.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger>How can I track my order?</AccordionTrigger>
                <AccordionContent>
                  Once your order is shipped, you'll receive a tracking number via email. You can use this 
                  tracking number on our website or the carrier's website to track your package's location 
                  and estimated delivery time.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          
          <TabsContent value="terms" className="mt-6 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-3">1. Terms of Use</h2>
              <p className="text-muted-foreground">
                By accessing and using the Pythronix website, you agree to comply with and be bound by these 
                Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-3">2. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content on this website, including but not limited to text, graphics, logos, images, audio clips, 
                digital downloads, data compilations, and software, is the property of Pythronix and is protected by 
                Indian and international copyright laws. The compilation of all content on this site is the exclusive 
                property of Pythronix.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-3">3. User Account</h2>
              <p className="text-muted-foreground">
                To access certain features of the website, you may be required to register and create an account. 
                You are responsible for maintaining the confidentiality of your account information and for all 
                activities that occur under your account. You agree to notify us immediately of any unauthorized 
                use of your account.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-3">4. Product Information</h2>
              <p className="text-muted-foreground">
                We strive to provide accurate product information, but we do not warrant that product descriptions 
                or other content on the site is accurate, complete, reliable, current, or error-free. If a product 
                offered by Pythronix is not as described, your sole remedy is to return it in unused condition.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-3">5. Pricing and Payment</h2>
              <p className="text-muted-foreground">
                All prices are in Indian Rupees (INR) unless otherwise specified. We reserve the right to change 
                prices at any time. Payment must be received prior to shipment of products. We accept various 
                payment methods as indicated on our website.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-3">6. Shipping and Delivery</h2>
              <p className="text-muted-foreground">
                Shipping and handling charges are additional unless otherwise expressly indicated at the time of sale. 
                Delivery dates are estimates only. Pythronix is not liable for any delays in shipments or damages 
                resulting from delivery delays.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-3">7. Returns and Refunds</h2>
              <p className="text-muted-foreground">
                Products may be returned within 30 days of delivery for a full refund or exchange, provided they are 
                in their original condition and packaging. Some items may be subject to a restocking fee. Certain 
                products, such as custom or specially ordered items, may not be eligible for return.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-3">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Pythronix shall not be liable for any direct, indirect, incidental, special, consequential, or punitive 
                damages resulting from your use or inability to use the website or products purchased through the website.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-3">9. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms and Conditions shall be governed by and construed in accordance with the laws of India, 
                without regard to its conflict of law principles. Any dispute arising under or relating to these Terms 
                and Conditions shall be subject to the exclusive jurisdiction of the courts in Assam, India.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-3">10. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to update or modify these Terms and Conditions at any time without prior notice. 
                Your continued use of the website following any changes constitutes your acceptance of such changes.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
