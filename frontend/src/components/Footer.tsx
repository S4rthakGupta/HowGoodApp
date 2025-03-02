import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center px-4 py-2 bg-gray-100 bottom-0 w-full ">
      {/* Top row: Logos */}
      <div className="flex justify-between items-center w-full mb-2">
        <div className="flex items-center">
          <Image
            src="/images/logo2.png"  // HowGood logo on the right
            alt="HowGood Logo"
            width={140}  // Increased logo size
            height={90}  // Increased logo size
          />
        </div>

        <div className="flex items-center">
          <Image
            src="/images/conhacks.png"  // Conhack image on the left
            alt="Conhacks Logo"
            width={140}  // Increased logo size
            height={90}  // Increased logo size
          />
        </div>
      </div>

      {/* Copyright text */}
      <div className="text-center text-xs text-gray-600 mb-1">
        <p>©️ {new Date().getFullYear()} HowGood. All rights reserved.</p>
      </div>

      {/* Bottom row: Navigation links */}
      <div className="flex space-x-6 text-center text-xs mb-1 mt-10">
        <Link href="/" className="hover:text-gray-900 transition duration-200">Home</Link>
        <Link href="/about" className="hover:text-gray-900 transition duration-200">About</Link>
        <Link href="/products" className="hover:text-gray-900 transition duration-200">Products</Link>
      </div>

    </footer>
  );
};

export default Footer;