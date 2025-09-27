"use client";

import * as React from "react";
import { CheckCircle, XCircle, Clock, Search, Link, Download, AlertCircle } from "lucide-react";

import { Progress } from "@/components/ui/progress-bar";
import { StatusChip, type StatusChipProps } from "@/components/ui/status-chip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Job, JobStatus, Article, ArticleStatus } from "@/types";
import { formatJobStatus } from "@/utils";

interface JobProgressProps {
  job: Job;
  articles?: Article[];
  onStartSearch?: () => void;
  onStartResolve?: () => void;
  onStartDownload?: () => void;
  className?: string;
}

export function JobProgress({
  job,
  articles = [],
  onStartSearch,
  onStartResolve,
  onStartDownload,
  className,
}: JobProgressProps) {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Update current time every second for relative time display
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStageProgress = () => {
    const stages = [
      { id: 'queued', label: 'Queued', status: JobStatus.QUEUED },
      { id: 'searching', label: 'Searching', status: JobStatus.SEARCHING },
      { id: 'resolving', label: 'Resolving', status: JobStatus.RESOLVING },
      { id: 'downloading', label: 'Downloading', status: JobStatus.DOWNLOADING },
      { id: 'completed', label: 'Completed', status: JobStatus.COMPLETED },
    ];

    const currentStageIndex = stages.findIndex(stage =>
      stage.status === job.status
    );

    return {
      stages,
      currentStageIndex: Math.max(0, currentStageIndex),
      progress: Math.max(0, (currentStageIndex / (stages.length - 1)) * 100),
    };
  };

  const getArticleStats = () => {
    const stats = {
      total: articles.length,
      pending: 0,
      resolved: 0,
      downloading: 0,
      downloaded: 0,
      failed: 0,
      skipped: 0,
    };

    articles.forEach((article) => {
      switch (article.status) {
        case ArticleStatus.PENDING_URLS:
          stats.pending++;
          break;
        case ArticleStatus.RESOLVED:
          stats.resolved++;
          break;
        case ArticleStatus.DOWNLOADING:
          stats.downloading++;
          break;
        case ArticleStatus.DOWNLOADED:
          stats.downloaded++;
          break;
        case ArticleStatus.FAILED_SEARCH:
        case ArticleStatus.FAILED_PAYWALL:
          stats.failed++;
          break;
        case ArticleStatus.SKIPPED_NO_PMC:
        case ArticleStatus.SKIPPED_ROBOTS:
          stats.skipped++;
          break;
      }
    });

    return stats;
  };

  const getStageIcon = (stageId: string, isActive: boolean, isCompleted: boolean) => {
    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }

    if (isActive) {
      switch (stageId) {
        case 'searching':
          return <Search className="w-5 h-5 text-blue-600 animate-pulse" />;
        case 'resolving':
          return <Link className="w-5 h-5 text-orange-600 animate-pulse" />;
        case 'downloading':
          return <Download className="w-5 h-5 text-indigo-600 animate-pulse" />;
        default:
          return <Clock className="w-5 h-5 text-gray-600" />;
      }
    }

    return <Clock className="w-5 h-5 text-gray-400" />;
  };

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime);
    const diff = Math.floor((currentTime.getTime() - start.getTime()) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ${diff % 60}s`;
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const { stages, currentStageIndex, progress } = getStageProgress();
  const articleStats = getArticleStats();

  const hasErrors = articles.some(article =>
    article.status === ArticleStatus.FAILED_SEARCH ||
    article.status === ArticleStatus.FAILED_PAYWALL
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Progress Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusChip variant={job.status === JobStatus.FAILED ? "failed" : "default"}>
              {formatJobStatus(job.status)}
            </StatusChip>
            {job.created_at && (
              <span className="text-sm text-muted-foreground">
                Started {formatDuration(job.created_at)} ago
              </span>
            )}
          </div>

          {hasErrors && (
            <Button variant="outline" size="sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              View Errors
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      </div>

      {/* Stage Progress */}
      <div className="space-y-3">
        <h3 className="font-medium">Process Stages</h3>
        <div className="space-y-3">
          {stages.map((stage, index) => {
            const isActive = index === currentStageIndex;
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;

            return (
              <div
                key={stage.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border",
                  isCurrent && "border-primary bg-primary/5",
                  isCompleted && "border-green-200 bg-green-50 dark:bg-green-950/20",
                  !isCompleted && !isCurrent && "border-gray-200"
                )}
              >
                {getStageIcon(stage.id, isActive, isCompleted)}

                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium",
                    isCurrent && "text-primary",
                    isCompleted && "text-green-700 dark:text-green-300"
                  )}>
                    {stage.label}
                  </p>

                  {isCurrent && (
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Articles: {articleStats.total}</span>
                        <span>Downloaded: {articleStats.downloaded}</span>
                        {articleStats.failed > 0 && (
                          <span className="text-destructive">Failed: {articleStats.failed}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {isCompleted && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        {job.status === JobStatus.QUEUED && onStartSearch && (
          <Button onClick={onStartSearch}>
            <Search className="w-4 h-4 mr-2" />
            Start Search
          </Button>
        )}

        {job.status === JobStatus.SEARCHING && onStartResolve && (
          <Button onClick={onStartResolve} disabled>
            <Link className="w-4 h-4 mr-2" />
            Resolving Sources...
          </Button>
        )}

        {(job.status === JobStatus.RESOLVING || job.status === JobStatus.SEARCHING) && onStartDownload && (
          <Button onClick={onStartDownload} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Start Downloads
          </Button>
        )}
      </div>

      {/* Article Summary */}
      {articles.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Article Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{articleStats.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{articleStats.downloaded}</p>
              <p className="text-sm text-muted-foreground">Downloaded</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{articleStats.skipped}</p>
              <p className="text-sm text-muted-foreground">Skipped</p>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{articleStats.failed}</p>
              <p className="text-sm text-muted-foreground">Failed</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Summary */}
      {hasErrors && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-destructive" />
            <h4 className="font-medium text-destructive">Errors Detected</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            {articleStats.failed} articles failed to process. Check individual articles for details.
          </p>
        </div>
      )}
    </div>
  );
}
