'use client';

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const NavBar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white shadow-md py-2 px-8 flex justify-between items-center z-50 border-b border-gray-200">
      
      {/* Left Side: Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/images/logo2.png"
            alt="HowGood Logo"
            width={80}
            height={60}
            className="object-contain cursor-pointer"
          />
        </Link>
      </div>

      {/* Desktop Navigation Links */}
      <ul className="hidden md:flex space-x-6 text-lg font-medium text-gray-700">
        <li><Link href="/" className="hover:text-gray-900 transition duration-200">Home</Link></li>
        <li><Link href="/products" className="hover:text-gray-900 transition duration-200">Product Score</Link></li>
        <li><Link href="/about" className="hover:text-gray-900 transition duration-200">Our Team</Link></li>
      </ul>

      {/* Right Side: Authentication + Mobile Menu */}
      <div className="flex items-center space-x-4">
        
        {/* Authentication Buttons */}
        <SignedOut>
          <SignInButton mode="modal" className="px-4 py-2 bg-primary text-white rounded-md">
            Sign In
          </SignInButton>
        </SignedOut>

        
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

        {/* Mobile Menu (Dropdown) */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="p-2">
                ☰
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg rounded-md mt-2">
              <DropdownMenuItem><Link href="/">Home</Link></DropdownMenuItem>
              <DropdownMenuItem><Link href="/products">Products Score</Link></DropdownMenuItem>
              <DropdownMenuItem><Link href="/about">Our Team</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </nav>
  );
};

export default NavBar;
