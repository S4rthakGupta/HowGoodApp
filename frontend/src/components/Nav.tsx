'use client';

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

const NavBar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white shadow-md py-2 px-8 flex justify-between items-center z-50 border-b border-gray-200">
      {/* Left side: Logo with reduced top margin */}
      <div className="flex items-center mt-2">
        <Image
          src="/images/logo2.png"
          alt="HowGood Logo"
          width={80}  // Adjusted size for a lower navbar
          height={60}  // Reduced height of the logo to fit a smaller navbar
          className="object-contain"
        />
      </div>
      
      {/* Right side: Navigation Links & Auth Buttons */}
      <div className="flex items-center space-x-6">
        <ul className="flex space-x-6 text-lg font-medium text-gray-700">
          <li><Link href="/" className="hover:text-gray-900 transition duration-200">Home</Link></li>
          <li><Link href="/about" className="hover:text-gray-900 transition duration-200">About</Link></li>
        </ul>
        
        {/* Authentication Buttons */}
        <div>
          <SignedOut>
            <div className="bg-gray-900 text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-700 cursor-pointer transition duration-200">
              <SignInButton mode="modal" />
            </div>
          </SignedOut>
          <SignedIn>
            <div className="shadow-md">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;