import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusChip } from "@/components/ui/status-chip";
import { Progress } from "@/components/ui/progress-bar";
import { JobStatus, ArticleStatus } from "@/types";
import { formatJobStatus, formatArticleStatus } from "@/utils";

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">PubMed PDF Scraper</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Core UI Components Test</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Button Variants</label>
              <div className="flex gap-2 flex-wrap">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Input Component</label>
              <Input placeholder="Enter PubMed query..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status Chips</label>
              <div className="flex gap-2 flex-wrap">
                <StatusChip variant="queued">Queued</StatusChip>
                <StatusChip variant="searching">Searching</StatusChip>
                <StatusChip variant="resolving">Resolving</StatusChip>
                <StatusChip variant="downloading">Downloading</StatusChip>
                <StatusChip variant="completed">Completed</StatusChip>
                <StatusChip variant="failed">Failed</StatusChip>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Progress Bar</label>
              <div className="w-full max-w-md">
                <Progress value={75} />
                <p className="text-sm text-muted-foreground mt-2">75% Complete</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status Formatting</label>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Job Status: </span>
                  <span className="font-medium">{formatJobStatus(JobStatus.SEARCHING)}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Article Status: </span>
                  <span className="font-medium">{formatArticleStatus(ArticleStatus.DOWNLOADED)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Project Structure</h2>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Frontend structure is ready with:
            </p>
            <ul className="list-disc list-inside text-sm mt-2 space-y-1">
              <li>✅ Next.js with TypeScript and App Router</li>
              <li>✅ ShadCN/UI components library configured</li>
              <li>✅ Core UI components (Button, Input, Table, Progress, StatusChip, Modal)</li>
              <li>✅ TypeScript type definitions</li>
              <li>✅ Utility functions for validation and formatting</li>
              <li>✅ Application constants</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
