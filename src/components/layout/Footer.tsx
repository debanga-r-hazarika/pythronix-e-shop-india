
import { Link } from "react-router-dom";
import { categories } from "@/lib/data";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <Link to="/" className="text-2xl font-bold text-white mb-4 inline-block font-heading">
              Pythronix
            </Link>
            <p className="text-gray-400 mt-2">
              Your one-stop shop for quality IoT components, Arduino boards, sensors, and electronic parts in India.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800 p-2 hover:bg-pythronix-blue"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800 p-2 hover:bg-pythronix-blue"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.057 10.057 0 01-3.127 1.184A4.92 4.92 0 0011.25 8.03a13.908 13.908 0 01-8.15-4.153 4.929 4.929 0 001.522 6.574 4.887 4.887 0 01-2.23-.616v.06a4.926 4.926 0 003.95 4.827 4.917 4.917 0 01-2.224.085 4.93 4.93 0 004.6 3.42A9.88 9.88 0 010 19.54a13.94 13.94 0 007.548 2.212c9.057 0 14.01-7.502 14.01-14.01 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800 p-2 hover:bg-pythronix-blue"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800 p-2 hover:bg-pythronix-blue"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="text-gray-400 hover:text-pythronix-blue transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-pythronix-blue transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/sale" className="text-gray-400 hover:text-pythronix-blue transition-colors">
                  Sale Items
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="text-gray-400 hover:text-pythronix-blue transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-pythronix-blue transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-pythronix-blue transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-pythronix-blue transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-pythronix-blue mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-400">
                  123 Tech Park, Electronic City<br />
                  Bangalore, Karnataka 560100<br />
                  India
                </span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-pythronix-blue mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@pythronix.com" className="text-gray-400 hover:text-pythronix-blue transition-colors">
                  info@pythronix.com
                </a>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-pythronix-blue mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+919876543210" className="text-gray-400 hover:text-pythronix-blue transition-colors">
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="bg-gray-950 py-4">
        <div className="container">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div className="text-gray-400 text-sm">
              © {currentYear} Pythronix. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-pythronix-blue text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-pythronix-blue text-sm">
                Terms of Service
              </Link>
              <Link to="/shipping-policy" className="text-gray-400 hover:text-pythronix-blue text-sm">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
