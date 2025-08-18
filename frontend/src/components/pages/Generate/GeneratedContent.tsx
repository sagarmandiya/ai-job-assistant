import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Copy, Download } from "lucide-react";

interface GeneratedContentProps {
  activeTab: "cover-letter" | "outreach-email";
  generatedContent: string;
  subjectLines: string[];
  hasResume: boolean;
  onCopy: () => void;
  onDownload: () => void;
}

export function GeneratedContent({
  activeTab,
  generatedContent,
  subjectLines,
  hasResume,
  onCopy,
  onDownload
}: GeneratedContentProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>
              {activeTab === "outreach-email" 
                ? "Subject lines and email content ready to copy and send"
                : "Review and customize before using"
              }
            </CardDescription>
          </div>
          {generatedContent && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onCopy}>
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={onDownload}>
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {generatedContent ? (
          <div className="space-y-4">
            {/* Subject Lines for Outreach Emails */}
            {activeTab === "outreach-email" && subjectLines.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Subject Line Options:</h4>
                <ul className="space-y-1">
                  {subjectLines.map((subject, index) => (
                    <li key={index} className="text-sm text-blue-800 cursor-pointer hover:bg-blue-100 p-1 rounded" 
                        onClick={() => navigator.clipboard.writeText(subject)}>
                      {index + 1}. {subject}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-blue-700 mt-2">Click any subject line to copy it individually</p>
              </div>
            )}
            
            {/* Main Content */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">
                {activeTab === "outreach-email" ? "Email Content:" : "Cover Letter:"}
              </h4>
              <div className="whitespace-pre-wrap text-sm">
                {generatedContent}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Generated content will appear here</p>
            <p className="text-sm">
              {hasResume 
                ? "Enter a job description and click generate to start"
                : "Upload a resume and enter a job description to start"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
