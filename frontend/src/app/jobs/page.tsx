"use client";

import * as React from "react";
import { 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  RotateCcw,
  Trash2,
  ArrowUpDown,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusChip } from "@/components/ui/status-chip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Job, JobStatus } from "@/types";
import { formatJobStatus, formatDate } from "@/utils";

// Extended mock data for jobs page
const mockJobs: Job[] = [
  {
    id: "job_001",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    name: "Cardiology Research Papers",
    query: '("cardiology"[tiab]) AND ("myocardial infarction"[tiab])',
    max_results: 100,
    pmc_only: true,
    allow_external: false,
    concurrency: 3,
    status: JobStatus.COMPLETED,
  },
  {
    id: "job_002",
    created_at: new Date(Date.now() - 7200000).toISOString(),
    name: "Neurology Studies on Alzheimer's Disease",
    query: '("neurology"[tiab]) AND ("alzheimer\'s"[tiab])',
    max_results: 50,
    pmc_only: false,
    allow_external: true,
    concurrency: 2,
    status: JobStatus.FAILED,
    error_msg: "Rate limit exceeded",
  },
  {
    id: "job_003",
    created_at: new Date(Date.now() - 10800000).toISOString(),
    name: "Oncology Research - Breast Cancer",
    query: '("oncology"[tiab]) AND ("breast cancer"[tiab])',
    max_results: 75,
    pmc_only: false,
    allow_external: true,
    concurrency: 4,
    status: JobStatus.DOWNLOADING,
  },
  {
    id: "job_004",
    created_at: new Date(Date.now() - 14400000).toISOString(),
    name: "Pediatrics Vaccination Review",
    query: '("pediatrics"[tiab]) AND ("vaccination"[tiab])',
    max_results: 25,
    pmc_only: true,
    allow_external: false,
    concurrency: 2,
    status: JobStatus.SEARCHING,
  },
  {
    id: "job_005",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    name: "COVID-19 Treatment Studies",
    query: '("COVID-19"[tiab]) AND ("treatment"[tiab])',
    max_results: 200,
    pmc_only: false,
    allow_external: true,
    concurrency: 5,
    status: JobStatus.COMPLETED,
  },
  {
    id: "job_006",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    name: "Machine Learning in Healthcare",
    query: '("machine learning"[tiab]) AND ("healthcare"[tiab])',
    max_results: 150,
    pmc_only: false,
    allow_external: true,
    concurrency: 3,
    status: JobStatus.FAILED,
    error_msg: "Network timeout",
  },
];

type SortField = 'created_at' | 'name' | 'status' | 'max_results';
type SortOrder = 'asc' | 'desc';

export default function JobsPage() {
  const [jobs, setJobs] = React.useState<Job[]>(mockJobs);
  const [selectedJobs, setSelectedJobs] = React.useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<JobStatus | "all">("all");
  const [sortField, setSortField] = React.useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('desc');

  // Filter and sort jobs
  const filteredAndSortedJobs = React.useMemo(() => {
    let filtered = jobs.filter((job) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          job.name.toLowerCase().includes(searchLower) ||
          job.query.toLowerCase().includes(searchLower) ||
          job.id.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== "all" && job.status !== statusFilter) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [jobs, searchTerm, statusFilter, sortField, sortOrder]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedJobs(new Set(filteredAndSortedJobs.map(job => job.id)));
    } else {
      setSelectedJobs(new Set());
    }
  };

  const handleSelectJob = (jobId: string, checked: boolean) => {
    const newSelected = new Set(selectedJobs);
    if (checked) {
      newSelected.add(jobId);
    } else {
      newSelected.delete(jobId);
    }
    setSelectedJobs(newSelected);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getJobStats = () => {
    return {
      total: jobs.length,
      completed: jobs.filter(job => job.status === JobStatus.COMPLETED).length,
      failed: jobs.filter(job => job.status === JobStatus.FAILED).length,
      running: jobs.filter(job => 
        job.status === JobStatus.SEARCHING || 
        job.status === JobStatus.RESOLVING || 
        job.status === JobStatus.DOWNLOADING
      ).length,
    };
  };

  const stats = getJobStats();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="hover-lift">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">All Research Jobs</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor all your PubMed scraping jobs
          </p>
        </div>
        <Link href="/jobs/new">
          <Button className="btn-gradient hover-lift">
            <Plus className="w-4 h-4 mr-2" />
            New Job
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card-elevated p-4 hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Jobs</p>
            </div>
          </div>
        </div>

        <div className="card-elevated p-4 hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>

        <div className="card-elevated p-4 hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info/10 rounded-lg">
              <Clock className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-info">{stats.running}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </div>
        </div>

        <div className="card-elevated p-4 hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">{stats.failed}</p>
              <p className="text-sm text-muted-foreground">Failed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card-elevated p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search jobs by name, query, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All ({stats.total})
              </Button>
              <Button
                variant={statusFilter === JobStatus.COMPLETED ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(JobStatus.COMPLETED)}
              >
                Completed ({stats.completed})
              </Button>
              <Button
                variant={statusFilter === JobStatus.FAILED ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(JobStatus.FAILED)}
              >
                Failed ({stats.failed})
              </Button>
              <Button
                variant={statusFilter === JobStatus.DOWNLOADING ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(JobStatus.DOWNLOADING)}
              >
                Active ({stats.running})
              </Button>
            </div>
          </div>

          {selectedJobs.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedJobs.size} selected
              </span>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Jobs Table */}
      <div className="card-elevated overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b bg-muted/30">
          <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-muted-foreground">
            <div className="col-span-1">
              <Checkbox
                checked={selectedJobs.size === filteredAndSortedJobs.length && filteredAndSortedJobs.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </div>
            <div className="col-span-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('name')}
                className="h-auto p-0 font-medium hover:bg-transparent"
              >
                Job Name
                <ArrowUpDown className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="col-span-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('status')}
                className="h-auto p-0 font-medium hover:bg-transparent"
              >
                Status
                <ArrowUpDown className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="col-span-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('max_results')}
                className="h-auto p-0 font-medium hover:bg-transparent"
              >
                Results
                <ArrowUpDown className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="col-span-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('created_at')}
                className="h-auto p-0 font-medium hover:bg-transparent"
              >
                Created
                <ArrowUpDown className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="col-span-1 text-center">Actions</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y">
          {filteredAndSortedJobs.length === 0 ? (
            <div className="p-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Create your first research job to get started"
                }
              </p>
              <Link href="/jobs/new">
                <Button className="btn-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Job
                </Button>
              </Link>
            </div>
          ) : (
            filteredAndSortedJobs.map((job, index) => (
              <div
                key={job.id}
                className="px-6 py-4 hover:bg-muted/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1">
                    <Checkbox
                      checked={selectedJobs.has(job.id)}
                      onCheckedChange={(checked) => handleSelectJob(job.id, checked)}
                    />
                  </div>
                  
                  <div className="col-span-4 min-w-0">
                    <Link href={`/jobs/${job.id}`} className="block hover:text-primary transition-colors">
                      <h3 className="font-semibold truncate mb-1">{job.name}</h3>
                      <p className="text-sm text-muted-foreground font-mono truncate" title={job.query}>
                        {job.query}
                      </p>
                    </Link>
                  </div>
                  
                  <div className="col-span-2">
                    <StatusChip 
                      variant={
                        job.status === JobStatus.FAILED ? "failed" :
                        job.status === JobStatus.COMPLETED ? "completed" :
                        job.status === JobStatus.DOWNLOADING ? "downloading" :
                        job.status === JobStatus.SEARCHING ? "searching" :
                        "default"
                      }
                      animated={job.status === JobStatus.DOWNLOADING || job.status === JobStatus.SEARCHING}
                    >
                      {formatJobStatus(job.status)}
                    </StatusChip>
                    {job.error_msg && (
                      <p className="text-xs text-destructive mt-1 truncate" title={job.error_msg}>
                        {job.error_msg}
                      </p>
                    )}
                  </div>
                  
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{job.max_results}</span>
                      <div className="flex gap-1">
                        {job.pmc_only && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">PMC</Badge>
                        )}
                        {job.allow_external && (
                          <Badge variant="info" className="text-xs px-1.5 py-0.5">Ext</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {job.concurrency}x concurrent
                    </p>
                  </div>
                  
                  <div className="col-span-2">
                    <p className="text-sm">{formatDate(job.created_at)}</p>
                  </div>
                  
                  <div className="col-span-1 flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/jobs/${job.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Export Results
                        </DropdownMenuItem>
                        {job.status === JobStatus.FAILED && (
                          <DropdownMenuItem>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Retry Job
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Summary */}
      {filteredAndSortedJobs.length > 0 && (
        <div className="mt-6 text-sm text-muted-foreground text-center">
          Showing {filteredAndSortedJobs.length} of {jobs.length} jobs
        </div>
      )}
    </div>
  );
}
