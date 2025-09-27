"use client";

import * as React from "react";
import { 
  BookOpen, 
  Search, 
  Code, 
  Zap, 
  Shield, 
  Database,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  FileText,
  Settings,
  Play,
  AlertTriangle,
  Info,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = React.useState("introduction");
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const tableOfContents: TableOfContentsItem[] = [
    { id: "introduction", title: "Introduction", level: 1 },
    { id: "getting-started", title: "Getting Started", level: 1 },
    { id: "quick-start", title: "Quick Start Guide", level: 2 },
    { id: "first-job", title: "Creating Your First Job", level: 2 },
    { id: "pubmed-queries", title: "PubMed Query Syntax", level: 1 },
    { id: "basic-queries", title: "Basic Queries", level: 2 },
    { id: "advanced-queries", title: "Advanced Queries", level: 2 },
    { id: "field-tags", title: "Field Tags Reference", level: 2 },
    { id: "job-configuration", title: "Job Configuration", level: 1 },
    { id: "search-parameters", title: "Search Parameters", level: 2 },
    { id: "download-settings", title: "Download Settings", level: 2 },
    { id: "source-options", title: "Source Options", level: 2 },
    { id: "monitoring", title: "Monitoring & Management", level: 1 },
    { id: "job-status", title: "Understanding Job Status", level: 2 },
    { id: "progress-tracking", title: "Progress Tracking", level: 2 },
    { id: "error-handling", title: "Error Handling", level: 2 },
    { id: "best-practices", title: "Best Practices", level: 1 },
    { id: "optimization", title: "Performance Optimization", level: 2 },
    { id: "troubleshooting", title: "Troubleshooting", level: 1 },
    { id: "common-issues", title: "Common Issues", level: 2 },
    { id: "faq", title: "FAQ", level: 1 },
    { id: "api-reference", title: "API Reference", level: 1 },
  ];

  // Scroll spy effect
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        rootMargin: "-20% 0% -35% 0%",
        threshold: 0
      }
    );

    tableOfContents.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ 
    children, 
    language = "text", 
    id 
  }: { 
    children: string; 
    language?: string; 
    id?: string; 
  }) => (
    <div className="relative group">
      <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-sm">
        <code className={`language-${language}`}>{children}</code>
      </pre>
      {id && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => copyToClipboard(children, id)}
        >
          {copiedCode === id ? (
            <Check className="w-4 h-4 text-success" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      )}
    </div>
  );

  const InfoBox = ({ 
    type = "info", 
    title, 
    children 
  }: { 
    type?: "info" | "warning" | "success" | "tip";
    title: string;
    children: React.ReactNode;
  }) => {
    const styles = {
      info: "border-info/20 bg-info/5 text-info",
      warning: "border-warning/20 bg-warning/5 text-warning",
      success: "border-success/20 bg-success/5 text-success",
      tip: "border-primary/20 bg-primary/5 text-primary",
    };

    const icons = {
      info: Info,
      warning: AlertTriangle,
      success: CheckCircle,
      tip: HelpCircle,
    };

    const Icon = icons[type];

    return (
      <div className={cn("border rounded-lg p-4 my-4", styles[type])}>
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-2">{title}</h4>
            <div className="text-sm text-foreground">{children}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold mb-2">Documentation</h1>
                <p className="text-muted-foreground text-sm">
                  Complete guide to PubMed PDF Scraper
                </p>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search docs..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>

              {/* Table of Contents */}
              <nav className="space-y-1">
                {tableOfContents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                      item.level === 2 && "pl-6 text-muted-foreground",
                      activeSection === item.id && "bg-accent text-accent-foreground font-medium"
                    )}
                  >
                    {item.title}
                  </button>
                ))}
              </nav>

              {/* Quick Links */}
              <div className="pt-6 border-t border-border">
                <h3 className="font-semibold mb-3 text-sm">Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowRight className="w-3 h-3 mr-2" />
                    Dashboard
                  </Link>
                  <Link href="/jobs/new" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowRight className="w-3 h-3 mr-2" />
                    Create Job
                  </Link>
                  <a href="https://pubmed.ncbi.nlm.nih.gov/help/" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ExternalLink className="w-3 h-3 mr-2" />
                    PubMed Help
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              
              {/* Introduction */}
              <section id="introduction" className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold m-0">Introduction</h1>
                </div>
                
                <p className="text-lg text-muted-foreground mb-6">
                  Welcome to PubMed PDF Scraper - your automated solution for discovering and downloading 
                  research papers from PubMed and external sources.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="card-elevated p-4 text-center">
                    <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Fast & Efficient</h3>
                    <p className="text-sm text-muted-foreground">Concurrent processing for maximum speed</p>
                  </div>
                  <div className="card-elevated p-4 text-center">
                    <Shield className="w-8 h-8 text-success mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Reliable</h3>
                    <p className="text-sm text-muted-foreground">Built-in error handling and retry mechanisms</p>
                  </div>
                  <div className="card-elevated p-4 text-center">
                    <Database className="w-8 h-8 text-info mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Comprehensive</h3>
                    <p className="text-sm text-muted-foreground">Access to PMC and external journal sources</p>
                  </div>
                </div>

                <InfoBox type="tip" title="New to PubMed searching?">
                  <p>
                    If you're new to PubMed queries, start with our <a href="#quick-start" className="text-primary hover:underline">Quick Start Guide</a> 
                    {" "}to learn the basics, then explore the <a href="#pubmed-queries" className="text-primary hover:underline">PubMed Query Syntax</a> 
                    {" "}section for advanced techniques.
                  </p>
                </InfoBox>
              </section>

              {/* Getting Started */}
              <section id="getting-started" className="mb-16">
                <h1 className="text-3xl font-bold mb-6">Getting Started</h1>
                
                <p className="text-lg mb-6">
                  Get up and running with PubMed PDF Scraper in just a few minutes.
                </p>

                <div id="quick-start" className="mb-12">
                  <h2 className="text-2xl font-semibold mb-4">Quick Start Guide</h2>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Navigate to Create Job</h3>
                        <p className="text-muted-foreground mb-3">
                          Click the "New Job" button in the navigation or dashboard to start creating your research job.
                        </p>
                        <Link href="/jobs/new">
                          <Button size="sm" className="btn-gradient">
                            <Play className="w-3 h-3 mr-1" />
                            Create Job Now
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Configure Your Search</h3>
                        <p className="text-muted-foreground mb-3">
                          Enter your job name and PubMed query. Set your desired parameters like result limits and source preferences.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Monitor Progress</h3>
                        <p className="text-muted-foreground mb-3">
                          Track your job's progress in real-time through the dashboard and job details pages.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="first-job" className="mb-12">
                  <h2 className="text-2xl font-semibold mb-4">Creating Your First Job</h2>
                  
                  <p className="mb-4">
                    Let's walk through creating a simple research job to find articles about machine learning in healthcare.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">1. Basic Information</h4>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li><strong>Job Name:</strong> "Machine Learning in Healthcare"</li>
                        <li><strong>Query:</strong> ("machine learning"[tiab]) AND ("healthcare"[tiab])</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">2. Search Parameters</h4>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li><strong>Max Results:</strong> 50 (good starting point)</li>
                        <li><strong>Concurrency:</strong> 3 (balanced performance)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">3. Source Configuration</h4>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li><strong>PMC Only:</strong> Enabled (for open access papers)</li>
                        <li><strong>External Sources:</strong> Disabled (for faster processing)</li>
                      </ul>
                    </div>
                  </div>

                  <InfoBox type="success" title="Pro Tip">
                    <p>
                      Start with smaller result sets (25-50 articles) to test your queries before running larger jobs. 
                      You can always create additional jobs once you've refined your search terms.
                    </p>
                  </InfoBox>
                </div>
              </section>

              {/* PubMed Queries */}
              <section id="pubmed-queries" className="mb-16">
                <h1 className="text-3xl font-bold mb-6">PubMed Query Syntax</h1>
                
                <p className="text-lg mb-6">
                  Master PubMed's powerful search syntax to find exactly the research papers you need.
                </p>

                <div id="basic-queries" className="mb-12">
                  <h2 className="text-2xl font-semibold mb-4">Basic Queries</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Simple Text Search</h3>
                      <p className="mb-3">The most basic search uses simple keywords:</p>
                      <CodeBlock language="text" id="basic-1">diabetes</CodeBlock>
                      <p className="text-sm text-muted-foreground mt-2">
                        Searches for "diabetes" in all fields (title, abstract, authors, etc.)
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Phrase Search</h3>
                      <p className="mb-3">Use quotes to search for exact phrases:</p>
                      <CodeBlock language="text" id="basic-2">"machine learning"</CodeBlock>
                      <p className="text-sm text-muted-foreground mt-2">
                        Finds articles containing the exact phrase "machine learning"
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Boolean Operators</h3>
                      <p className="mb-3">Combine terms with AND, OR, and NOT:</p>
                      <CodeBlock language="text" id="basic-3">diabetes AND treatment</CodeBlock>
                      <CodeBlock language="text" id="basic-4">diabetes OR "diabetes mellitus"</CodeBlock>
                      <CodeBlock language="text" id="basic-5">diabetes NOT "type 1"</CodeBlock>
                    </div>
                  </div>
                </div>

                <div id="advanced-queries" className="mb-12">
                  <h2 className="text-2xl font-semibold mb-4">Advanced Queries</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Field-Specific Searches</h3>
                      <p className="mb-3">Target specific fields using field tags:</p>
                      <CodeBlock language="text" id="advanced-1">("machine learning"[tiab]) AND ("healthcare"[tiab])</CodeBlock>
                      <p className="text-sm text-muted-foreground mt-2">
                        Searches for both terms in title or abstract fields only
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Author Searches</h3>
                      <CodeBlock language="text" id="advanced-2">("Smith J"[au]) AND ("cancer research"[tiab])</CodeBlock>
                      <p className="text-sm text-muted-foreground mt-2">
                        Finds cancer research articles by author "Smith J"
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Date Ranges</h3>
                      <CodeBlock language="text" id="advanced-3">COVID-19[tiab] AND ("2020/01/01"[PDAT] : "2023/12/31"[PDAT])</CodeBlock>
                      <p className="text-sm text-muted-foreground mt-2">
                        COVID-19 articles published between 2020 and 2023
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Wildcards and Truncation</h3>
                      <CodeBlock language="text" id="advanced-4">cardio*[tiab]</CodeBlock>
                      <p className="text-sm text-muted-foreground mt-2">
                        Matches cardiology, cardiovascular, cardiomyopathy, etc.
                      </p>
                    </div>
                  </div>
                </div>

                <div id="field-tags" className="mb-12">
                  <h2 className="text-2xl font-semibold mb-4">Field Tags Reference</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border border-border rounded-lg">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Field Tag</th>
                          <th className="px-4 py-3 text-left font-semibold">Description</th>
                          <th className="px-4 py-3 text-left font-semibold">Example</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-4 py-3 font-mono text-sm">[tiab]</td>
                          <td className="px-4 py-3">Title or Abstract</td>
                          <td className="px-4 py-3 font-mono text-sm">diabetes[tiab]</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-mono text-sm">[ti]</td>
                          <td className="px-4 py-3">Title only</td>
                          <td className="px-4 py-3 font-mono text-sm">cancer[ti]</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-mono text-sm">[ab]</td>
                          <td className="px-4 py-3">Abstract only</td>
                          <td className="px-4 py-3 font-mono text-sm">treatment[ab]</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-mono text-sm">[au]</td>
                          <td className="px-4 py-3">Author</td>
                          <td className="px-4 py-3 font-mono text-sm">"Smith J"[au]</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-mono text-sm">[ta]</td>
                          <td className="px-4 py-3">Journal Title</td>
                          <td className="px-4 py-3 font-mono text-sm">"Nature"[ta]</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-mono text-sm">[pt]</td>
                          <td className="px-4 py-3">Publication Type</td>
                          <td className="px-4 py-3 font-mono text-sm">"clinical trial"[pt]</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-mono text-sm">[pdat]</td>
                          <td className="px-4 py-3">Publication Date</td>
                          <td className="px-4 py-3 font-mono text-sm">2023[pdat]</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Job Configuration */}
              <section id="job-configuration" className="mb-16">
                <h1 className="text-3xl font-bold mb-6">Job Configuration</h1>
                
                <p className="text-lg mb-6">
                  Understanding how to configure your jobs for optimal performance and results.
                </p>

                <div id="search-parameters" className="mb-12">
                  <h2 className="text-2xl font-semibold mb-4">Search Parameters</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Maximum Results</h3>
                      <p className="mb-3">
                        Controls how many articles to process. Range: 1-1000 articles.
                      </p>
                      <InfoBox type="warning" title="Performance Impact">
                        <p>
                          Larger result sets take longer to process and consume more resources. 
                          Start with 50-100 results for testing, then scale up as needed.
                        </p>
                      </InfoBox>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Download Concurrency</h3>
                      <p className="mb-3">
                        Number of parallel downloads. Range: 1-10 concurrent downloads.
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li><strong>1-2:</strong> Conservative, good for rate-limited sources</li>
                        <li><strong>3-5:</strong> Balanced performance (recommended)</li>
                        <li><strong>6-10:</strong> Aggressive, may trigger rate limits</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Date Filtering</h3>
                      <p className="mb-3">
                        Optional publication date range filtering.
                      </p>
                      <CodeBlock language="text" id="config-1">From: 2020-01-01
To: 2023-12-31</CodeBlock>
                      <p className="text-sm text-muted-foreground mt-2">
                        Leave empty to include all publication dates
                      </p>
                    </div>
                  </div>
                </div>

                <div id="download-settings" className="mb-12">
                  <h2 className="text-2xl font-semibold mb-4">Download Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card-elevated p-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        PMC Only Mode
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Restricts search to PubMed Central articles only
                      </p>
                      <Badge variant="success" className="text-xs">Recommended for Open Access</Badge>
                    </div>

                    <div className="card-elevated p-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Database className="w-4 h-4 text-info" />
                        External Sources
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Enables crawling of external journal websites
                      </p>
                      <Badge variant="warning" className="text-xs">May Increase Processing Time</Badge>
                    </div>
                  </div>
                </div>

                <div id="source-options" className="mb-12">
                  <h2 className="text-2xl font-semibold mb-4">Source Options</h2>
                  
                  <div className="space-y-4">
                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">PMC Only vs. All Sources</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-success mb-2">PMC Only Benefits:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Faster processing</li>
                            <li>• Open access guaranteed</li>
                            <li>• Higher success rate</li>
                            <li>• Consistent formatting</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-info mb-2">All Sources Benefits:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Broader coverage</li>
                            <li>• More recent articles</li>
                            <li>• Access to premium journals</li>
                            <li>• Complete research landscape</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Monitoring */}
              <section id="monitoring" className="mb-16">
                <h1 className="text-3xl font-bold mb-6">Monitoring & Management</h1>
                
                <div id="job-status" className="mb-12">
                  <h2 className="text-2xl font-semibold mb-4">Understanding Job Status</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">Queued</Badge>
                        <span className="text-sm">Job is waiting to start</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="default">Searching</Badge>
                        <span className="text-sm">Finding articles in PubMed</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="warning">Resolving</Badge>
                        <span className="text-sm">Locating PDF sources</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="info">Downloading</Badge>
                        <span className="text-sm">Downloading PDF files</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="success">Completed</Badge>
                        <span className="text-sm">Job finished successfully</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="destructive">Failed</Badge>
                        <span className="text-sm">Job encountered errors</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="progress-tracking" className="mb-12">
                  <h2 className="text-2xl font-semibold mb-4">Progress Tracking</h2>
                  <p className="mb-4">
                    Monitor your jobs in real-time through the dashboard and detailed job pages.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Dashboard Overview</h4>
                      <p className="text-sm text-muted-foreground">
                        Quick statistics and recent job status updates
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Job Details Page</h4>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive progress tracking with article-level details
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Real-time Updates</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatic refresh every 2 seconds for active jobs
                      </p>
                    </div>
                  </div>
                </div>

                <div id="error-handling" className="mb-12">
                  <h2 className="text-2xl font-semibold mb-4">Error Handling</h2>
                  
                  <InfoBox type="info" title="Automatic Retry System">
                    <p>
                      The system automatically retries failed downloads up to 3 times with exponential backoff 
                      to handle temporary network issues and rate limiting.
                    </p>
                  </InfoBox>

                  <div className="mt-6 space-y-4">
                    <h4 className="font-semibold">Common Error Types:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Rate Limit Exceeded:</strong> Too many requests to source
                          <p className="text-sm text-muted-foreground">Solution: Reduce concurrency or retry later</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Paywall Detected:</strong> Article requires subscription
                          <p className="text-sm text-muted-foreground">Solution: Enable PMC-only mode or check institutional access</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Network Timeout:</strong> Connection issues
                          <p className="text-sm text-muted-foreground">Solution: Automatic retry will handle this</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Best Practices */}
              <section id="best-practices" className="mb-16">
                <h1 className="text-3xl font-bold mb-6">Best Practices</h1>
                
                <div id="optimization" className="mb-12">
                  <h2 className="text-2xl font-semibold mb-4">Performance Optimization</h2>
                  
                  <div className="space-y-6">
                    <InfoBox type="tip" title="Query Optimization">
                      <ul className="space-y-1">
                        <li>• Use specific field tags ([tiab], [au], [ta]) to narrow searches</li>
                        <li>• Test queries with small result sets first</li>
                        <li>• Use date ranges to limit scope when appropriate</li>
                        <li>• Combine related terms with OR to capture variations</li>
                      </ul>
                    </InfoBox>

                    <InfoBox type="success" title="Resource Management">
                      <ul className="space-y-1">
                        <li>• Start with concurrency of 3-5 for optimal balance</li>
                        <li>• Enable PMC-only for faster, more reliable downloads</li>
                        <li>• Schedule large jobs during off-peak hours</li>
                        <li>• Monitor job progress and adjust parameters as needed</li>
                      </ul>
                    </InfoBox>

                    <InfoBox type="warning" title="Rate Limiting Considerations">
                      <ul className="space-y-1">
                        <li>• Respect publisher rate limits and robots.txt</li>
                        <li>• Reduce concurrency if encountering frequent errors</li>
                        <li>• Avoid running multiple large jobs simultaneously</li>
                        <li>• Consider institutional access for better success rates</li>
                      </ul>
                    </InfoBox>
                  </div>
                </div>
              </section>

              {/* Troubleshooting */}
              <section id="troubleshooting" className="mb-16">
                <h1 className="text-3xl font-bold mb-6">Troubleshooting</h1>
                
                <div id="common-issues" className="mb-12">
                  <h2 className="text-2xl font-semibold mb-4">Common Issues</h2>
                  
                  <div className="space-y-6">
                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Job Stuck in "Searching" Status</h3>
                      <p className="text-muted-foreground mb-3">
                        The job appears to be stuck and not progressing past the search phase.
                      </p>
                      <div className="text-sm">
                        <strong>Possible Causes:</strong>
                        <ul className="list-disc pl-6 mt-1 space-y-1">
                          <li>Complex query taking longer than expected</li>
                          <li>PubMed API temporary unavailability</li>
                          <li>Network connectivity issues</li>
                        </ul>
                        <strong className="block mt-3">Solutions:</strong>
                        <ul className="list-disc pl-6 mt-1 space-y-1">
                          <li>Wait 5-10 minutes for complex queries</li>
                          <li>Simplify your query and try again</li>
                          <li>Check PubMed availability at pubmed.ncbi.nlm.nih.gov</li>
                        </ul>
                      </div>
                    </div>

                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">High Failure Rate</h3>
                      <p className="text-muted-foreground mb-3">
                        Many articles are failing to download with paywall or access errors.
                      </p>
                      <div className="text-sm">
                        <strong>Solutions:</strong>
                        <ul className="list-disc pl-6 mt-1 space-y-1">
                          <li>Enable "PMC Only" mode for open access articles</li>
                          <li>Reduce concurrency to avoid rate limiting</li>
                          <li>Check if your institution has access to the journals</li>
                          <li>Focus on recent articles which are more likely to be open access</li>
                        </ul>
                      </div>
                    </div>

                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">No Results Found</h3>
                      <p className="text-muted-foreground mb-3">
                        Your search query returns zero results.
                      </p>
                      <div className="text-sm">
                        <strong>Solutions:</strong>
                        <ul className="list-disc pl-6 mt-1 space-y-1">
                          <li>Test your query directly on PubMed first</li>
                          <li>Remove field tags to broaden the search</li>
                          <li>Check for spelling errors in your query</li>
                          <li>Use broader terms or synonyms</li>
                          <li>Remove date restrictions if present</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="mb-16">
                <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
                
                <div className="space-y-6">
                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">How many articles can I download at once?</h3>
                    <p className="text-muted-foreground">
                      You can configure jobs to download 1-1000 articles. We recommend starting with 50-100 
                      articles for testing, then scaling up based on your needs and system performance.
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">What's the difference between PMC and external sources?</h3>
                    <p className="text-muted-foreground">
                      PMC (PubMed Central) contains open access articles that are freely available. External 
                      sources include publisher websites that may require subscriptions. PMC-only jobs are 
                      faster and more reliable.
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Can I modify a job after it's started?</h3>
                    <p className="text-muted-foreground">
                      No, jobs cannot be modified once started. However, you can create a new job with 
                      different parameters. Running jobs can be cancelled from the job details page.
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">How long do jobs typically take?</h3>
                    <p className="text-muted-foreground">
                      Job duration depends on the number of articles, concurrency settings, and source availability. 
                      PMC-only jobs with 50 articles typically complete in 2-5 minutes. External source jobs may 
                      take 10-30 minutes for the same number of articles.
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Are there any usage limits?</h3>
                    <p className="text-muted-foreground">
                      We implement fair usage policies to ensure system stability. This includes rate limiting 
                      and concurrency limits. Contact support if you need higher limits for institutional use.
                    </p>
                  </div>
                </div>
              </section>

              {/* API Reference */}
              <section id="api-reference" className="mb-16">
                <h1 className="text-3xl font-bold mb-6">API Reference</h1>
                
                <p className="text-lg mb-6">
                  Complete API documentation for programmatic access to PubMed PDF Scraper.
                </p>

                <InfoBox type="info" title="API Access">
                  <p>
                    API access is available for enterprise users. Contact support to request API credentials 
                    and access to our REST API endpoints.
                  </p>
                </InfoBox>

                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4">Available Endpoints</h2>
                  
                  <div className="space-y-4">
                    <div className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="success" className="text-xs">POST</Badge>
                        <code className="text-sm">/api/jobs</code>
                      </div>
                      <p className="text-sm text-muted-foreground">Create a new research job</p>
                    </div>

                    <div className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="info" className="text-xs">GET</Badge>
                        <code className="text-sm">/api/jobs</code>
                      </div>
                      <p className="text-sm text-muted-foreground">List all jobs</p>
                    </div>

                    <div className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="info" className="text-xs">GET</Badge>
                        <code className="text-sm">/api/jobs/:id</code>
                      </div>
                      <p className="text-sm text-muted-foreground">Get job details and progress</p>
                    </div>

                    <div className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="warning" className="text-xs">DELETE</Badge>
                        <code className="text-sm">/api/jobs/:id</code>
                      </div>
                      <p className="text-sm text-muted-foreground">Cancel or delete a job</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-muted/30 rounded-lg text-center">
                  <p className="text-muted-foreground mb-4">
                    Need help getting started or have questions?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/dashboard">
                      <Button>
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
