import { Facebook, Instagram, Youtube } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-items-center text-center">
          {/* Help & Information */}
          <div className="w-full">
            <h3 className="text-sm font-medium mb-4 text-white">HELP & INFORMATION</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/user/return-exchange" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div className="w-full">
            <h3 className="text-sm font-medium mb-4 text-white">ABOUT US</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                  About SECTOR 91
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="w-full">
            <h3 className="text-sm font-medium mb-4 text-white">LEGAL</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-8">
              <a 
                href="https://www.instagram.com/avinash_threadz?igsh=aTJ1MmZ2a2J6ODFi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://www.facebook.com/share/1CYQgiKpT6/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a 
                href="https://youtube.com/@sector_91" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube size={24} />
              </a>
              <a 
                href="https://chat.whatsapp.com/CNo3yF9YLrE0LxdQhpwQns" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaWhatsapp size={24} />
              </a>
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} SECTOR 91. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}