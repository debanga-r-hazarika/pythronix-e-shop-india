
import MainLayout from "@/components/layout/MainLayout";

export default function Contact() {
  return (
    <MainLayout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Get in Touch</h2>
              <p>Have questions or need help? Reach us anytime:</p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                <a href="tel:+919101227640" className="text-pythronix-blue underline">
                  +91 91012 27640
                </a>
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                <a href="mailto:contact@pythronix.in" className="text-pythronix-blue underline">
                  contact@pythronix.in
                </a>
              </p>
              <p>
                <span className="font-semibold">Location:</span> Nakari-2, North Lakhimpur,<br />
                Assam, India 787001
              </p>
            </div>
          </div>
          <div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1997.342001509839!2d94.10203700238469!3d27.253394991145893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1745389571951!5m2!1sen!2sin"
              width="100%"
              height="350"
              style={{ border: 0, borderRadius: "12px" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Pythronix Location"
            ></iframe>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
