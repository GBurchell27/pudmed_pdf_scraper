"use client";

import * as React from "react";
import { 
  Plus, 
  FileText,
  Download,
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
  Users,
  Database,
  CheckCircle,
  Globe,
  Clock,
  Star
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Concurrent downloading with intelligent rate limiting for optimal performance",
    },
    {
      icon: Shield,
      title: "Reliable & Robust",
      description: "Built-in retry mechanisms and error handling for consistent results",
    },
    {
      icon: BarChart3,
      title: "Advanced Tracking",
      description: "Comprehensive progress tracking and detailed reporting for all your research",
    },
    {
      icon: Database,
      title: "Smart Filtering",
      description: "Intelligent article filtering and deduplication to save time and storage",
    },
  ];

  const stats = [
    { value: "10K+", label: "Articles Downloaded", icon: Download },
    { value: "500+", label: "Researchers Worldwide", icon: Users },
    { value: "99.9%", label: "Uptime Reliability", icon: CheckCircle },
    { value: "24/7", label: "Available", icon: Clock },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Research Scientist, Stanford University",
      content: "This tool has revolutionized my literature review process. What used to take days now takes hours.",
    },
    {
      name: "Prof. Michael Rodriguez",
      role: "Department Head, MIT",
      content: "The automated PDF collection is incredibly reliable. It's become essential for our research team.",
    },
    {
      name: "Dr. Emily Watson",
      role: "Principal Investigator, Johns Hopkins",
      content: "The smart filtering saves us countless hours by eliminating duplicate papers automatically.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Research Made
                <span className="text-gradient block">Effortless</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Automate your PubMed research workflow with intelligent article discovery, 
                smart filtering, and seamless PDF downloading.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="btn-gradient hover-lift text-lg px-8 py-3">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3 hover-lift">
                  <FileText className="w-5 h-5 mr-2" />
                  View Documentation
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-border/50">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-5 h-5 text-primary mr-2" />
                    <div className="text-3xl font-bold text-primary">
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Powerful Features for Modern Research
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to streamline your academic research workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card-elevated p-6 text-center hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Configure Search</h3>
              <p className="text-muted-foreground">
                Enter your PubMed query and set parameters like result limits and source preferences
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Auto Discovery</h3>
              <p className="text-muted-foreground">
                Our system searches PubMed, finds relevant articles, and locates downloadable PDFs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Download & Organize</h3>
              <p className="text-muted-foreground">
                Get organized PDFs with metadata, progress tracking, and detailed reports
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Trusted by Researchers Worldwide
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what leading researchers say about our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card-elevated p-6 hover-lift animate-fade-in"
                   style={{ animationDelay: `${index * 200}ms` }}>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="card-elevated p-8 lg:p-12 text-center max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold">
                  Ready to Accelerate Your Research?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of researchers who trust our platform to streamline their 
                  literature discovery and PDF collection workflow.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/dashboard">
                  <Button size="lg" className="btn-gradient hover-lift text-lg px-8 py-3">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Get Started Now
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-3 hover-lift">
                    <FileText className="w-5 h-5 mr-2" />
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className="pt-8 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  Trusted by researchers at leading institutions worldwide
                </p>
                <div className="flex items-center justify-center gap-6 mt-4 opacity-60">
                  <span className="text-sm font-medium">Stanford</span>
                  <span className="text-sm font-medium">MIT</span>
                  <span className="text-sm font-medium">Harvard</span>
                  <span className="text-sm font-medium">Johns Hopkins</span>
                  <span className="text-sm font-medium">Oxford</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
