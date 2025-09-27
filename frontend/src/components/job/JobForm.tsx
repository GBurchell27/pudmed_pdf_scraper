"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusChip } from "@/components/ui/status-chip";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { validatePubMedQuery } from "@/utils";
import { JOB_DEFAULTS, JOB_LIMITS } from "@/constants";

const jobFormSchema = z.object({
  name: z.string().min(1, "Job name is required").max(100, "Name too long"),
  query: z.string().min(1, "Query is required"),
  max_results: z.number().min(JOB_LIMITS.MAX_RESULTS_MIN).max(JOB_LIMITS.MAX_RESULTS_MAX),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  pmc_only: z.boolean(),
  allow_external: z.boolean(),
  concurrency: z.number().min(JOB_LIMITS.CONCURRENCY_MIN).max(JOB_LIMITS.CONCURRENCY_MAX),
});

type JobFormData = z.infer<typeof jobFormSchema>;

interface JobFormProps {
  onSubmit: (data: JobFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<JobFormData>;
  isSubmitting?: boolean;
  className?: string;
}

export function JobForm({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false,
  className
}: JobFormProps) {
  const [queryValidation, setQueryValidation] = React.useState<{
    isValid: boolean;
    error?: string;
  }>({ isValid: true });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      query: initialData?.query || "",
      max_results: initialData?.max_results || JOB_DEFAULTS.MAX_RESULTS,
      date_from: initialData?.date_from || "",
      date_to: initialData?.date_to || "",
      pmc_only: initialData?.pmc_only ?? JOB_DEFAULTS.PMC_ONLY,
      allow_external: initialData?.allow_external ?? JOB_DEFAULTS.ALLOW_EXTERNAL,
      concurrency: initialData?.concurrency || JOB_DEFAULTS.CONCURRENCY,
    },
  });

  const queryValue = watch("query");
  const maxResultsValue = watch("max_results");
  const concurrencyValue = watch("concurrency");

  // Real-time query validation
  React.useEffect(() => {
    if (queryValue) {
      const validation = validatePubMedQuery(queryValue);
      setQueryValidation(validation);
    } else {
      setQueryValidation({ isValid: true });
    }
  }, [queryValue]);

  const handleFormSubmit = (data: JobFormData) => {
    if (!queryValidation.isValid) {
      return;
    }
    onSubmit(data);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(handleFormSubmit)} className={cn("space-y-8", className)}>
        {/* Basic Information */}
        <div className="form-section">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">1</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Basic Information</h3>
              <p className="text-sm text-muted-foreground">Configure your research job details</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="form-field">
              <label htmlFor="name" className="form-label">
                Job Name *
              </label>
              <Input
                id="name"
                placeholder="e.g., Atrial Fibrillation Research"
                {...register("name")}
                className={cn(
                  "transition-all duration-200 hover:border-input-hover focus:border-primary",
                  errors.name && "border-destructive focus:border-destructive"
                )}
              />
              {errors.name && (
                <p className="form-error">{errors.name.message}</p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="query" className="form-label">
                PubMed Search Query *
              </label>
              <textarea
                id="query"
                placeholder="e.g., (&quot;atrial fibrillation&quot;[tiab]) AND (malnutrition[tiab])"
                rows={5}
                {...register("query")}
                className={cn(
                  "flex min-h-[120px] w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-input-hover resize-none",
                  !queryValidation.isValid && "border-destructive focus-visible:ring-destructive"
                )}
              />
              <div className="flex items-center justify-between mt-3">
                <StatusChip
                  variant={queryValidation.isValid ? "completed" : "failed"}
                  animated={!queryValidation.isValid}
                >
                  {queryValidation.isValid ? "Valid Query" : "Invalid Query"}
                </StatusChip>
                {queryValidation.error && (
                  <span className="text-sm text-destructive">{queryValidation.error}</span>
                )}
              </div>
              <p className="form-helper mt-2">
                Use PubMed search syntax with fields like [tiab] for title/abstract or [au] for author
              </p>
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="form-section">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">2</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Search Parameters</h3>
              <p className="text-sm text-muted-foreground">Fine-tune your search criteria and limits</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-field">
                <label htmlFor="max_results" className="form-label">
                  Maximum Results
                </label>
                <Input
                  id="max_results"
                  type="number"
                  min={JOB_LIMITS.MAX_RESULTS_MIN}
                  max={JOB_LIMITS.MAX_RESULTS_MAX}
                  {...register("max_results", { valueAsNumber: true })}
                  className={cn(
                    "transition-all duration-200 hover:border-input-hover focus:border-primary",
                    errors.max_results && "border-destructive focus:border-destructive"
                  )}
                />
                <p className="form-helper">
                  Limit: {JOB_LIMITS.MAX_RESULTS_MIN} - {JOB_LIMITS.MAX_RESULTS_MAX} articles
                </p>
                {errors.max_results && (
                  <p className="form-error">{errors.max_results.message}</p>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="concurrency" className="form-label">
                  Download Concurrency
                </label>
                <Input
                  id="concurrency"
                  type="number"
                  min={JOB_LIMITS.CONCURRENCY_MIN}
                  max={JOB_LIMITS.CONCURRENCY_MAX}
                  {...register("concurrency", { valueAsNumber: true })}
                  className={cn(
                    "transition-all duration-200 hover:border-input-hover focus:border-primary",
                    errors.concurrency && "border-destructive focus:border-destructive"
                  )}
                />
                <p className="form-helper">
                  Parallel downloads: {JOB_LIMITS.CONCURRENCY_MIN} - {JOB_LIMITS.CONCURRENCY_MAX}
                </p>
                {errors.concurrency && (
                  <p className="form-error">{errors.concurrency.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-field">
                <label htmlFor="date_from" className="form-label">
                  Publication Date From
                </label>
                <Input
                  id="date_from"
                  type="date"
                  {...register("date_from")}
                  className={cn(
                    "transition-all duration-200 hover:border-input-hover focus:border-primary",
                    errors.date_from && "border-destructive focus:border-destructive"
                  )}
                />
                <p className="form-helper">Optional: Filter by publication date range</p>
                {errors.date_from && (
                  <p className="form-error">{errors.date_from.message}</p>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="date_to" className="form-label">
                  Publication Date To
                </label>
                <Input
                  id="date_to"
                  type="date"
                  {...register("date_to")}
                  className={cn(
                    "transition-all duration-200 hover:border-input-hover focus:border-primary",
                    errors.date_to && "border-destructive focus:border-destructive"
                  )}
                />
                <p className="form-helper">Leave empty to include all recent papers</p>
                {errors.date_to && (
                  <p className="form-error">{errors.date_to.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Source Options */}
        <div className="form-section">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">3</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Source Configuration</h3>
              <p className="text-sm text-muted-foreground">Choose which sources to include in your search</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
              <Checkbox
                id="pmc_only"
                {...register("pmc_only")}
                className="mt-0.5"
              />
              <div className="space-y-1">
                <label htmlFor="pmc_only" className="form-label cursor-pointer">
                  PMC Only Mode
                </label>
                <p className="text-sm text-muted-foreground">
                  Restrict search to PubMed Central articles only (free full-text available)
                </p>
                <Badge variant="info" className="text-xs">
                  Recommended for open access research
                </Badge>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
              <Checkbox
                id="allow_external"
                {...register("allow_external")}
                className="mt-0.5"
              />
              <div className="space-y-1">
                <label htmlFor="allow_external" className="form-label cursor-pointer">
                  External Sources
                </label>
                <p className="text-sm text-muted-foreground">
                  Enable crawling of external journal websites for additional PDFs
                </p>
                <Badge variant="warning" className="text-xs">
                  May increase processing time
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-border/50">
          <Button 
            type="submit" 
            disabled={isSubmitting || !queryValidation.isValid}
            className="btn-gradient hover-lift flex-1 sm:flex-initial"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner w-4 h-4 mr-2" />
                Creating Job...
              </>
            ) : (
              "Create Research Job"
            )}
          </Button>
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              size="lg"
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Live Preview Summary */}
      <div className="card-elevated p-6 sticky top-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center">
            <span className="text-sm font-semibold">📋</span>
          </div>
          <h4 className="font-semibold text-lg">Job Preview</h4>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-muted-foreground mb-1">Job Name</p>
              <p className="text-foreground">{watch("name") || "Untitled Job"}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground mb-1">Max Results</p>
              <p className="text-foreground">{maxResultsValue} articles</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground mb-1">Concurrency</p>
              <p className="text-foreground">{concurrencyValue} parallel downloads</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground mb-1">Sources</p>
              <div className="flex gap-1 flex-wrap">
                <Badge variant={watch("pmc_only") ? "success" : "secondary"} className="text-xs">
                  {watch("pmc_only") ? "PMC Only" : "All Sources"}
                </Badge>
                {watch("allow_external") && (
                  <Badge variant="info" className="text-xs">External</Badge>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <p className="font-medium text-muted-foreground mb-2">Search Query</p>
            <div className="bg-muted/50 p-3 rounded-lg">
              <code className="text-xs text-foreground break-all">
                {queryValue || "No query specified"}
              </code>
            </div>
          </div>

          {(watch("date_from") || watch("date_to")) && (
            <div>
              <p className="font-medium text-muted-foreground mb-2">Date Range</p>
              <p className="text-sm text-foreground">
                {watch("date_from") || "Any"} → {watch("date_to") || "Latest"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function truncateQuery(query: string, maxLength: number): string {
  if (query.length <= maxLength) return query;
  return query.substring(0, maxLength - 3) + "...";
}
