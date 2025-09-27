"use client";

import * as React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function MainLayout({ 
  children, 
  className,
  showHeader = true,
  showFooter = true 
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Skip Links for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium"
      >
        Skip to main content
      </a>
      
      {showHeader && <Header />}
      
      <main 
        id="main-content"
        className={cn("flex-1", className)}
        role="main"
        tabIndex={-1}
      >
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}
