import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Mail, Loader2 } from "lucide-react";

interface GenerationFormProps {
  activeTab: "cover-letter" | "outreach-email";
  jobDescription: string;
  setJobDescription: (value: string) => void;
  additionalContext: string;
  setAdditionalContext: (value: string) => void;
  onSaveJobDescription: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  isSavingJob: boolean;
  hasResume: boolean;
}

export default function GenerationForm({
  activeTab,
  jobDescription,
  setJobDescription,
  additionalContext,
  setAdditionalContext,
  onSaveJobDescription,
  onGenerate,
  isGenerating,
  isSavingJob,
  hasResume
}: GenerationFormProps) {
  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {activeTab === "cover-letter" ? <FileText className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
          Generate {activeTab === "cover-letter" ? "Cover Letter" : "Outreach Email"}
        </CardTitle>
        <CardDescription>
          {activeTab === "cover-letter" 
            ? "Create a personalized cover letter for your job application"
            : "Generate a professional email with subject line options for networking and outreach"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Job Description Input */}
        <div>
          <Label htmlFor="jobDescription">Job Description</Label>
          <Textarea
            id="jobDescription"
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            className="min-h-[200px]"
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              {jobDescription.length} characters
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveJobDescription}
              disabled={isSavingJob || !jobDescription.trim()}
            >
              {isSavingJob ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Job Description"
              )}
            </Button>
          </div>
        </div>

        {/* Additional Context */}
        <div>
          <Label htmlFor="context">Additional Context (Optional)</Label>
          <Textarea
            id="context"
            placeholder={
              activeTab === "cover-letter"
                ? "Add any specific details you want to highlight..."
                : "Mention specific aspects of the company or role you want to connect about..."
            }
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            rows={4}
          />
        </div>

        {/* Generate Button */}
        <Button 
          className="btn-primary w-full" 
          onClick={onGenerate}
          disabled={isGenerating || !jobDescription.trim() || !hasResume}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              {activeTab === "cover-letter" ? <FileText className="w-4 h-4 mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
              Generate {activeTab === "cover-letter" ? "Cover Letter" : "Outreach Email"}
            </>
          )}
        </Button>
        
        {!hasResume && (
          <p className="text-xs text-muted-foreground text-center">
            Upload a resume first to enable content generation
          </p>
        )}
      </CardContent>
    </Card>
  );
}