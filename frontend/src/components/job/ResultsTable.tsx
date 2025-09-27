"use client";

import * as React from "react";
import { MoreHorizontal, Download, Eye, RotateCcw, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusChip, type StatusChipProps } from "@/components/ui/status-chip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Article, ArticleStatus } from "@/types";
import { formatArticleStatus } from "@/utils";

interface ResultsTableProps {
  articles: Article[];
  onRetryArticle?: (articleId: string) => void;
  onPreviewArticle?: (article: Article) => void;
  onDownloadArticle?: (articleId: string) => void;
  onBulkRetry?: (articleIds: string[]) => void;
  onBulkDownload?: (articleIds: string[]) => void;
  className?: string;
}

export function ResultsTable({
  articles,
  onRetryArticle,
  onPreviewArticle,
  onDownloadArticle,
  onBulkRetry,
  onBulkDownload,
  className,
}: ResultsTableProps) {
  const [selectedArticles, setSelectedArticles] = React.useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = React.useState<ArticleStatus | "all">("all");
  const [searchTerm, setSearchTerm] = React.useState("");

  // Filter and search articles
  const filteredArticles = React.useMemo(() => {
    return articles.filter((article) => {
      // Status filter
      if (statusFilter !== "all" && article.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          article.title.toLowerCase().includes(searchLower) ||
          article.pmid.toLowerCase().includes(searchLower) ||
          (article.pmc_id && article.pmc_id.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  }, [articles, statusFilter, searchTerm]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedArticles(new Set(filteredArticles.map((a) => a.id)));
    } else {
      setSelectedArticles(new Set());
    }
  };

  const handleSelectArticle = (articleId: string, checked: boolean) => {
    const newSelected = new Set(selectedArticles);
    if (checked) {
      newSelected.add(articleId);
    } else {
      newSelected.delete(articleId);
    }
    setSelectedArticles(newSelected);
  };

  const handleBulkAction = (action: "retry" | "download") => {
    const selectedIds = Array.from(selectedArticles);
    if (selectedIds.length === 0) return;

    if (action === "retry" && onBulkRetry) {
      onBulkRetry(selectedIds);
    } else if (action === "download" && onBulkDownload) {
      onBulkDownload(selectedIds);
    }

    setSelectedArticles(new Set());
  };

  const getStatusCounts = () => {
    const counts = {
      all: articles.length,
      [ArticleStatus.PENDING_URLS]: 0,
      [ArticleStatus.RESOLVED]: 0,
      [ArticleStatus.DOWNLOADING]: 0,
      [ArticleStatus.DOWNLOADED]: 0,
      [ArticleStatus.FAILED_SEARCH]: 0,
      [ArticleStatus.FAILED_PAYWALL]: 0,
      [ArticleStatus.SKIPPED_NO_PMC]: 0,
      [ArticleStatus.SKIPPED_ROBOTS]: 0,
    };

    articles.forEach((article) => {
      counts[article.status]++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            All ({statusCounts.all})
          </Button>
          <Button
            variant={statusFilter === ArticleStatus.DOWNLOADED ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(ArticleStatus.DOWNLOADED)}
          >
            Downloaded ({statusCounts[ArticleStatus.DOWNLOADED]})
          </Button>
          <Button
            variant={statusFilter === ArticleStatus.FAILED_SEARCH ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(ArticleStatus.FAILED_SEARCH)}
          >
            Failed ({statusCounts[ArticleStatus.FAILED_SEARCH] + statusCounts[ArticleStatus.FAILED_PAYWALL]})
          </Button>
          <Button
            variant={statusFilter === ArticleStatus.SKIPPED_NO_PMC ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(ArticleStatus.SKIPPED_NO_PMC)}
          >
            Skipped ({statusCounts[ArticleStatus.SKIPPED_NO_PMC] + statusCounts[ArticleStatus.SKIPPED_ROBOTS]})
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedArticles.size > 0 && (
        <div className="flex gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">
            {selectedArticles.size} selected
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkAction("retry")}
            disabled={!onBulkRetry}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Retry Selected
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkAction("download")}
            disabled={!onBulkDownload}
          >
            <Download className="w-4 h-4 mr-1" />
            Download Selected
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedArticles.size === filteredArticles.length && filteredArticles.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>PMID</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No articles found
                </TableCell>
              </TableRow>
            ) : (
              filteredArticles.map((article) => (
                <ArticleRow
                  key={article.id}
                  article={article}
                  isSelected={selectedArticles.has(article.id)}
                  onSelect={(checked) => handleSelectArticle(article.id, checked)}
                  onRetry={onRetryArticle ? () => onRetryArticle(article.id) : undefined}
                  onPreview={onPreviewArticle ? () => onPreviewArticle(article) : undefined}
                  onDownload={onDownloadArticle ? () => onDownloadArticle(article.id) : undefined}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredArticles.length} of {articles.length} articles
      </div>
    </div>
  );
}

interface ArticleRowProps {
  article: Article;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onRetry?: () => void;
  onPreview?: () => void;
  onDownload?: () => void;
}

function ArticleRow({
  article,
  isSelected,
  onSelect,
  onRetry,
  onPreview,
  onDownload,
}: ArticleRowProps) {
  const getStatusVariant = (status: ArticleStatus): StatusChipProps["variant"] => {
    switch (status) {
      case ArticleStatus.DOWNLOADED:
        return "completed";
      case ArticleStatus.FAILED_SEARCH:
      case ArticleStatus.FAILED_PAYWALL:
        return "failed";
      case ArticleStatus.SKIPPED_NO_PMC:
      case ArticleStatus.SKIPPED_ROBOTS:
        return "skipped";
      case ArticleStatus.RESOLVED:
        return "resolving";
      case ArticleStatus.DOWNLOADING:
        return "downloading";
      case ArticleStatus.PENDING_URLS:
        return "queued";
      default:
        return "default";
    }
  };

  return (
    <TableRow className={cn(isSelected && "bg-muted/50")}>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
        />
      </TableCell>
      <TableCell>
        <div className="max-w-md">
          <p className="font-medium truncate" title={article.title}>
            {article.title}
          </p>
          {article.failure_reason && (
            <p className="text-xs text-destructive mt-1">
              {article.failure_reason}
            </p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <a
          href={article.pubmed_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {article.pmid}
        </a>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          {article.pmc_id && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              PMC: {article.pmc_id}
            </span>
          )}
          {article.external_url && (
            <a
              href={article.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              External
            </a>
          )}
        </div>
      </TableCell>
      <TableCell>
        <StatusChip variant={getStatusVariant(article.status)}>
          {formatArticleStatus(article.status)}
        </StatusChip>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onPreview && (
              <DropdownMenuItem onClick={onPreview}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </DropdownMenuItem>
            )}
            {onDownload && article.status === ArticleStatus.RESOLVED && (
              <DropdownMenuItem onClick={onDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
            )}
            {onRetry && article.status !== ArticleStatus.DOWNLOADED && (
              <DropdownMenuItem onClick={onRetry}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
