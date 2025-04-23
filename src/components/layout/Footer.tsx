
import { Github, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Pythronix</h3>
            <p className="text-slate-400 mb-4">
              Your one-stop shop for premium IoT components, Arduino boards, sensors, and electronic parts.
            </p>
            <div className="flex space-x-2">
              <a href="https://github.com/pythronix" className="hover:text-white">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-slate-400 hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-slate-400 hover:text-white">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/featured" className="text-slate-400 hover:text-white">
                  Featured Products
                </Link>
              </li>
              <li>
                <Link to="/sale" className="text-slate-400 hover:text-white">
                  Sale
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Help & Information</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-400 hover:text-white">
                  FAQ & Terms
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-slate-400 hover:text-white">
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex">
                <Phone className="h-5 w-5 mr-2 text-slate-400" />
                <a href="tel:+919101227640" className="text-slate-400 hover:text-white">
                  +91 91012 27640
                </a>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 mr-2 text-slate-400" />
                <a href="mailto:contact@pythronix.in" className="text-slate-400 hover:text-white">
                  contact@pythronix.in
                </a>
              </li>
              <li className="text-slate-400">
                Nakari-2, North Lakhimpur,<br />
                Assam, India 787001
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>© {new Date().getFullYear()} Pythronix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
