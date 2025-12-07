import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ArrowRight, Hotel } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-pop-black text-white pt-16 pb-8 mt-auto border-t-3 border-pop-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-pop-yellow rounded-none border-2 border-white shadow-[4px_4px_0px_0px_#ffffff]">
                <Hotel className="h-8 w-8 text-pop-black" />
              </div>
              <span className="text-3xl font-display font-black text-white tracking-tighter uppercase">LuxeStay</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed font-medium">
              We take fun seriously. Experience the most vibrant stays with our unique pop-art inspired hotels.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-pop-blue text-pop-black border-2 border-white hover:bg-pop-pink hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_#ffffff]"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="p-2 bg-pop-mint text-pop-black border-2 border-white hover:bg-pop-pink hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_#ffffff]"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="p-2 bg-pop-purple text-pop-black border-2 border-white hover:bg-pop-pink hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_#ffffff]"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-display font-black text-pop-yellow mb-6 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-300 hover:text-pop-pink hover:underline decoration-2 underline-offset-4 transition-colors font-bold">Our Story</a></li>
              <li><a href="#" className="text-gray-300 hover:text-pop-pink hover:underline decoration-2 underline-offset-4 transition-colors font-bold">Rooms & Suites</a></li>
              <li><a href="#" className="text-gray-300 hover:text-pop-pink hover:underline decoration-2 underline-offset-4 transition-colors font-bold">Dining</a></li>
              <li><a href="#" className="text-gray-300 hover:text-pop-pink hover:underline decoration-2 underline-offset-4 transition-colors font-bold">Spa & Wellness</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-display font-black text-pop-mint mb-6 uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-pop-mint mt-1 flex-shrink-0" />
                <span className="text-gray-300 font-medium">123 Pop Art Avenue,<br />Design District, NY 10012</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-pop-mint flex-shrink-0" />
                <span className="text-gray-300 font-bold">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-pop-mint flex-shrink-0" />
                <span className="text-gray-300 font-bold">hello@luxestay.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-display font-black text-pop-pink mb-6 uppercase tracking-wider">Stay in the Loop</h3>
            <p className="text-gray-300 text-sm mb-4 font-medium">Subscribe for exclusive offers and colorful updates.</p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-pop-pink focus:bg-gray-900 transition-colors font-bold"
              />
              <button
                type="submit"
                className="w-full bg-pop-pink text-pop-black font-black uppercase tracking-wider py-3 px-4 border-2 border-white hover:bg-white hover:text-pop-black transition-all shadow-[4px_4px_0px_0px_#ffffff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex justify-center items-center group"
              >
                Subscribe <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t-2 border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm font-bold">© 2024 LuxeStay Management. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-pop-yellow text-sm font-bold uppercase">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-pop-yellow text-sm font-bold uppercase">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;