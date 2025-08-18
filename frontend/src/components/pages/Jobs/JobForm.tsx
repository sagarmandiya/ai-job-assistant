import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Plus, Loader2 } from "lucide-react";

interface JobFormProps {
  newJobTitle: string;
  newJobCompany: string;
  newJobDescription: string;
  isSubmitting: boolean;
  onTitleChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
}

export function JobForm({
  newJobTitle,
  newJobCompany,
  newJobDescription,
  isSubmitting,
  onTitleChange,
  onCompanyChange,
  onDescriptionChange,
  onSubmit
}: JobFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Add New Job
        </CardTitle>
        <CardDescription>
          Save a job description for AI-powered analysis and content generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="job-title">Job Title</Label>
              <Input
                id="job-title"
                value={newJobTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                disabled={isSubmitting}
                className="break-words"
                maxLength={100}
              />
            </div>
            <div>
              <Label htmlFor="job-company">Company</Label>
              <Input
                id="job-company"
                value={newJobCompany}
                onChange={(e) => onCompanyChange(e.target.value)}
                placeholder="e.g., Google"
                disabled={isSubmitting}
                className="break-words"
                maxLength={100}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              value={newJobDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={8}
              disabled={isSubmitting}
              className="resize-none break-words"
              maxLength={5000}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">
                {newJobDescription.length} / 5000 characters
              </p>
              {newJobDescription.length > 4000 && (
                <p className="text-xs text-orange-600">
                  Approaching character limit
                </p>
              )}
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting || !newJobDescription.trim()}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving Job...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Save Job
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
