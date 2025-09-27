"use client";

import * as React from "react";
import Link from "next/link";
import { Github, ExternalLink, Heart } from "lucide-react";

import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn(
      "border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-xs">
                PM
              </div>
              <span className="font-semibold">PubMed Scraper</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Automated research paper discovery and PDF downloading from PubMed and external sources.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Product</h4>
            <nav className="space-y-2">
              <Link href="/features" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/changelog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Changelog
              </Link>
              <Link href="/roadmap" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Roadmap
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Resources</h4>
            <nav className="space-y-2">
              <Link href="/docs" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </Link>
              <Link href="/api" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                API Reference
              </Link>
              <Link href="/guides" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Guides
              </Link>
              <Link href="/examples" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Examples
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Support</h4>
            <nav className="space-y-2">
              <Link href="/help" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Help Center
              </Link>
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
              <Link href="/status" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                System Status
                <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
              <Link href="/privacy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>© 2024 PubMed Scraper. All rights reserved.</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="https://github.com" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </Link>
            
            <div className="flex items-center text-xs text-muted-foreground">
              Made with <Heart className="w-3 h-3 mx-1 text-red-500" /> for researchers
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
