'use client';

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white shadow-md py-4 px-8 flex justify-between items-center z-50">
      <h1 className="text-2xl font-semibold tracking-wide">HowGood</h1>
      <ul className="flex space-x-6 text-lg">
        <li><Link href="/" className="hover:text-gray-600">Home</Link></li>
        <li><Link href="/about" className="hover:text-gray-600">About</Link></li>
        <li>
          <SignedOut>
            <div className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700 cursor-pointer">
              <SignInButton mode="modal" />
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;