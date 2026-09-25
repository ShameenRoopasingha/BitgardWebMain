"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Home, Info, Phone, MonitorSmartphone, Menu, X, ChevronDown, Package, FileText, Briefcase, HelpCircle } from "lucide-react";

export const FloatingNavbar = ({ className }: { className?: string }) => {
  const navItems = [
    { name: "Home", link: "/" },
    { 
      name: "Products", 
      link: "/products",
      dropdown: [
        { name: "POS + Inventory", link: "/products/pos", desc: "Sell smarter. Stock effortlessly.", icon: <MonitorSmartphone className="w-5 h-5 text-primary" /> },
        { name: "Vehicle Hire", link: "/products/vehicle-hire", desc: "Manage your fleet and bookings.", icon: <Package className="w-5 h-5 text-primary" /> },
        { name: "HRM System", link: "/products/hrm", desc: "Your people, perfectly managed.", icon: <Briefcase className="w-5 h-5 text-primary" /> }
      ]
    },
    { name: "Solutions", link: "/solutions" },
    { name: "About", link: "/about" },
    { name: "Blog", link: "/blog" },
    { name: "Contact", link: "/contact" },
  ];
  
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;
      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
          setHoveredDropdown(null);
        }
      }
    }
  });

  return (
    <>
    {/* Desktop Navbar */}
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "hidden md:flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-primary/20 rounded-full bg-black/40 backdrop-blur-md shadow-[0_0_20px_rgba(232,115,42,0.1)] z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-6",
          className
        )}
      >
        <div className="flex items-center gap-2 mr-4">
            <span className="font-heading font-bold text-xl tracking-wider text-white">BITGARD</span>
        </div>
        {navItems.map((navItem: any, idx: number) => (
          <div 
            key={`link=${idx}`} 
            className="relative"
            onMouseEnter={() => navItem.dropdown ? setHoveredDropdown(navItem.name) : setHoveredDropdown(null)}
            onMouseLeave={() => setHoveredDropdown(null)}
          >
            <Link
              href={navItem.link}
              className="relative text-neutral-300 flex items-center gap-1 hover:text-white transition-colors py-2 text-sm font-medium group"
            >
              <span>{navItem.name}</span>
              {navItem.dropdown && <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-transform group-hover:rotate-180" />}
              {/* Hover Underline Animation */}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>

            {/* Mega Dropdown */}
            {navItem.dropdown && hoveredDropdown === navItem.name && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[350px]"
              >
                <div className="bg-black/80 backdrop-blur-xl border border-primary/30 rounded-2xl p-2 shadow-[0_10px_40px_rgba(232,115,42,0.15)]">
                  {navItem.dropdown.map((dropItem: any, dIdx: number) => (
                    <Link
                      key={dIdx}
                      href={dropItem.link}
                      className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group/item"
                    >
                      <div className="mt-1 bg-primary/10 p-2 rounded-lg border border-primary/20 group-hover/item:border-primary/50 transition-colors">
                        {dropItem.icon}
                      </div>
                      <div>
                        <div className="text-white font-medium mb-1 group-hover/item:text-primary transition-colors">{dropItem.name}</div>
                        <div className="text-xs text-neutral-400 line-clamp-2">{dropItem.desc}</div>
                      </div>
                    </Link>
                  ))}
                  <div className="mt-2 p-2 border-t border-white/10">
                    <Link href={navItem.link} className="block text-center text-xs font-medium text-primary hover:text-white transition-colors py-1">
                      View all products →
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ))}
        <button className="bg-primary hover:bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(232,115,42,0.4)] hover:shadow-[0_0_25px_rgba(232,115,42,0.6)] transition-all transform hover:-translate-y-0.5">
          Get Started
        </button>
      </motion.div>
    </AnimatePresence>
    
    {/* Mobile Circular Navbar */}
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{
          y: (visible || isMobileMenuOpen) ? 0 : -100,
          opacity: (visible || isMobileMenuOpen) ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="md:hidden fixed top-6 right-6 z-[5000] flex flex-col items-end"
      >
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="absolute top-20 right-0 flex flex-col gap-4 bg-black/90 backdrop-blur-2xl border border-primary/50 p-4 rounded-2xl min-w-[250px] shadow-[0_0_30px_rgba(232,115,42,0.2)] origin-top-right"
            >
              {navItems.map((navItem: any, idx: number) => (
                <div key={`mobile-link=${idx}`}>
                  <Link
                    href={navItem.link}
                    onClick={() => !navItem.dropdown && setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between text-neutral-300 hover:text-primary transition-colors py-3 px-2 border-b border-white/5"
                  >
                    <span className="text-sm font-medium">{navItem.name}</span>
                    {navItem.dropdown && <ChevronDown className="w-4 h-4" />}
                  </Link>
                  {navItem.dropdown && (
                    <div className="pl-4 pr-2 py-2 flex flex-col gap-2">
                      {navItem.dropdown.map((dropItem: any, dIdx: number) => (
                        <Link
                          key={dIdx}
                          href={dropItem.link}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 py-2 text-neutral-400 hover:text-primary transition-colors"
                        >
                          {dropItem.icon}
                          <span className="text-xs">{dropItem.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <button className="w-full mt-4 bg-primary text-sm font-bold text-white px-4 py-3 rounded-xl hover:shadow-[0_0_15px_rgba(232,115,42,0.4)] transition-all">
                Get Started
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="h-14 w-14 rounded-full bg-black/80 backdrop-blur-2xl border border-primary/50 text-primary flex items-center justify-center shadow-[0_0_20px_rgba(232,115,42,0.3)] hover:bg-primary/20 transition-all"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </motion.div>
    </AnimatePresence>
    </>
  );
};
