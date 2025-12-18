import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Contact Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/assets/logo.png"
                  alt="ResolveCars Logo"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <span className="text-xl font-bold">
                resolve<span className="text-white">cars</span>
              </span>
            </Link>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">PHONE HOURS</h3>
              <div className="space-y-2 text-sm opacity-90">
                <p>Telephone Sales Service</p>
                <p>Available 24/7</p>
                <p>Monday to Friday: 9am to 5pm</p>
                <p>Saturday & Sunday: 10am to 4pm</p>
              </div>
            </div>
          </div>

          {/* About Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ABOUT US</h3>
            <div className="space-y-2 text-sm opacity-90">
              <Link href="/about" className="block hover:text-white/80 transition-colors">
                Resolvecars Corporate
              </Link>
              <Link href="/company" className="block hover:text-white/80 transition-colors">
                Company News
              </Link>
              <Link href="/press" className="block hover:text-white/80 transition-colors">
                Press room
              </Link>
              <Link href="/magazine" className="block hover:text-white/80 transition-colors">
                Resolvecars Magazine
              </Link>
              <Link href="/work" className="block hover:text-white/80 transition-colors">
                Work with Us
              </Link>
              <Link href="/investors" className="block hover:text-white/80 transition-colors">
                Investors
              </Link>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">INFO</h3>
            <div className="space-y-2 text-sm opacity-90">
              <Link href="/contact" className="block hover:text-white/80 transition-colors">
                Car Help
              </Link>
              <Link href="/contact" className="block hover:text-white/80 transition-colors">
                Customer Service
              </Link>
              <Link href="/privacy" className="block hover:text-white/80 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/legal" className="block hover:text-white/80 transition-colors">
                Legal Information
              </Link>
              <Link href="/cookies" className="block hover:text-white/80 transition-colors">
                Cookies
              </Link>
              <Link href="/sitemap" className="block hover:text-white/80 transition-colors">
                Sitemap Changer
              </Link>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">CONTACT</h3>
            <div className="space-y-3 text-sm opacity-90">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@resolvecars.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>123 Car Street<br />Auto City, AC 12345</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="font-semibold">Follow Us</h4>
              <div className="flex space-x-3">
                <Link
                  href="https://instagram.com"
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="w-4 h-4" />
                </Link>
                <Link
                  href="https://youtube.com"
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm opacity-75">
              © 2025 @ ResolveCars.com All rights reserved
            </p>
            <div className="flex space-x-6 text-sm opacity-75">
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
