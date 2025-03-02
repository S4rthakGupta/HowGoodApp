import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center px-16 py-8 bg-gray-100">
      {/* Top row: Logos */}
      <div className="flex justify-between items-center w-full mb-4">
        <div className="flex items-center">
          <Image 
            src="/images/Conhack.png"  // Conhack image on the left
            alt="Conhacks Logo"
            width={100}
            height={100}
          />
        </div>

        <div className="flex items-center">
          <Image 
            src="/images/logo2.png"  // HowGood logo on the right
            alt="HowGood Logo"
            width={120}
            height={80}
          />
        </div>
      </div>

      {/* Copyright text */}
      <div className="text-center text-sm text-gray-600 mb-4">
        <p>©️ {new Date().getFullYear()} HowGood. All rights reserved.</p>
      </div>

      {/* Bottom row: Navigation links */}
      <div className="flex space-x-8 text-center mb-4">
        <Link href="/" className="hover:text-gray-900 transition duration-200">Home</Link>
        <Link href="/about" className="hover:text-gray-900 transition duration-200">About</Link>
        <Link href="/products" className="hover:text-gray-900 transition duration-200">Products</Link>
      </div>
    </footer>
  );
};

export default Footer;
