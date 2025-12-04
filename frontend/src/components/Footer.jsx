import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaBookOpen } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Footer = () => {
  const handleDeadLink = (e) => {
    e.preventDefault();
    toast('Coming Soon! This feature is under development.', {
      icon: '🚧',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <FaBookOpen className="text-3xl text-blue-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                BookBazaar
              </span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed max-w-md">
              Your premier destination for literary adventures. Discover, read, and grow with our curated collection of books from around the globe.
            </p>
            <div className="flex gap-4">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
                <button
                  key={index}
                  onClick={handleDeadLink}
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  <Icon />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'Blog', 'Press'].map((item) => (
                <li key={item}>
                  <button 
                    onClick={handleDeadLink}
                    className="text-slate-400 hover:text-blue-400 transition-colors inline-block hover:translate-x-1 duration-300 text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Shop</h4>
            <ul className="space-y-4">
              {['All Books', 'Bestsellers', 'New Arrivals', 'Deals'].map((item) => (
                <li key={item}>
                  <button 
                    onClick={handleDeadLink}
                    className="text-slate-400 hover:text-blue-400 transition-colors inline-block hover:translate-x-1 duration-300 text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Support</h4>
            <ul className="space-y-4">
              {['Help Center', 'Shipping', 'Returns', 'Contact Us'].map((item) => (
                <li key={item}>
                  <button 
                    onClick={handleDeadLink}
                    className="text-slate-400 hover:text-blue-400 transition-colors inline-block hover:translate-x-1 duration-300 text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2025 BookBazaar. All rights reserved.
          </p>
          <div className="flex gap-8">
            {['Privacy Policy', 'Terms of Service', 'Cookies'].map((item) => (
              <button 
                key={item} 
                onClick={handleDeadLink}
                className="text-slate-500 hover:text-blue-400 text-sm transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
