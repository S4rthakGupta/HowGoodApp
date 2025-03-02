import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-6 px-4">
      {/* Top row: Logos */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full mb-0">
        
        {/* Left: HowGood Logo */}
        <div className="mb-0 md:mb-0">
          <Image
            src="/images/logo2.png"
            alt="HowGood Logo"
            width={80}
            height={50}
          />
        </div>

        {/* Right: Conhacks Logo */}
        <div>
          <Image
            src="/images/conhacks.png"
            alt="Conhacks Logo"
            width={100}
            height={90}
          />
        </div>

      </div>
        <div className="text-center text-2xl text-black italic"><strong>Developed By: Desi Guru's</strong></div>

      {/* Navigation Links */}
      <div className="flex justify-center space-x-6 text-sm font-medium text-gray-700 mt-4">
        <Link href="/" className="hover:text-gray-900 transition duration-200">Home</Link>
        <Link href="/products" className="hover:text-gray-900 transition duration-200">Product Score</Link>
        <Link href="/about" className="hover:text-gray-900 transition duration-200">Our Team</Link>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-600 mt-4">
        <p>© {new Date().getFullYear()} HowGood. All rights reserved.</p>
      </div>

    </footer>
  );
};

export default Footer;
