"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Phone, User, LogOut, Settings, Car, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // toggle manually true/false
  const [user] = useState({
    name: "John Smith",
    email: "john@example.com",
    avatar: "/assets/user.jpg",
  });

  // Prevent hydration errors by only rendering Radix UI components after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Cars" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
  const pathname = usePathname();
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative w-20 h-10">
            <Image
              src="/assets/logo.png"
              alt="ResolveCars Logo"
              fill
              className="h-full w-full object-contain"
            />
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative transition-all duration-200 group ${
                  isActive ? "text-[#F5807C] font-semibold" : "text-black"
                }`}
              >
                <span>{link.label}</span>
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-[#F5807C] transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5 space-x-5">
          {/* Phone */}
          <div className="hidden lg:flex items-center text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <span className="text-sm">(555) 123-4567</span>
          </div>

          {/* Auth Section */}
          {mounted && isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium text-gray-800">
                    {user.name}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/my-bookings" className="flex items-center gap-2">
                    <Car className="mr-2 h-4 w-4" /> My Bookings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                  <LogOut className="mr-2 h-4 w-4" /> Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !mounted ? (
            // Fallback during SSR to prevent hydration mismatch
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium text-gray-800">
                {user.name}
              </span>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
          {/* Mobile Menu */}
          <div className="md:hidden">
            {mounted ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative w-20 h-10">
                    <Image
                      src="/assets/logo.png"
                      alt="ResolveCars Logo"
                      fill
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="text-base text-gray-800">
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="mt-6">
                  {isLoggedIn ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 mt-2">
                      <Button variant="ghost" asChild>
                        <Link href="/auth/signin">Sign In</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/auth/signup">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            ) : (
              // Fallback during SSR to prevent hydration mismatch
              <Button variant="ghost" size="icon" aria-label="Open menu" disabled>
                <Menu className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
