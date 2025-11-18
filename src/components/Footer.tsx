import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Mail } from "lucide-react"; // Importing icons

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#7fff5d] text-black py-10 mt-16 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 text-center md:text-left">
          {/* Logo and Brand Info */}
          <div className="md:col-span-2 lg:col-span-2 flex flex-col items-center md:items-start">
            <Link to="/" className="mb-4">
              <img
                src="https://i.ibb.co/SwdmSkZ2/bold1234.png"
                alt="Bold Logo"
                className="h-14"
              />
            </Link>
            <p className="text-base text-gray-800 leading-relaxed">
              Bold is a decentralized prediction market platform built on
              Solana. Make your predictions and seize the future.
            </p>
            <p className="text-base text-gray-800 mt-4">
              &copy; {new Date().getFullYear()} Bold. All rights reserved.
            </p>
          </div>

          {/* Company Links */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              Company
            </h4>
            <Link
              to="/privacy-policy"
              className="text-lg hover:text-gray-700 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-lg hover:text-gray-700 transition-colors"
            >
              Terms of Service
            </Link>
            {/* Add more company links if needed */}
          </div>

          {/* Support Links */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              Support
            </h4>
            <a
              href="mailto:support@predictwithbold.com"
              className="text-lg hover:text-gray-700 transition-colors flex items-center gap-2"
            >
              <Mail size={20} />
              <span>Contact Us</span>
            </a>
            {/* Add FAQ or Help Center links if available */}
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              Follow Us
            </h4>
            <a
              href="https://x.com/predictwithbold"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg hover:text-gray-700 transition-colors flex items-center gap-2"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg"
                alt="X (formerly Twitter) logo"
                className="h-6 w-6"
              />
              <span>Twitter</span>
            </a>
            {/* Add more social media links if available */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
