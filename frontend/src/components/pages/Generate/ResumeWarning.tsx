import { AlertCircle } from "lucide-react";

interface ResumeWarningProps {
  hasResume: boolean;
}

export function ResumeWarning({ hasResume }: ResumeWarningProps) {
  if (hasResume) return null;

  return (
    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
      <AlertCircle className="w-4 h-4 text-yellow-600" />
      <div>
        <p className="text-sm text-yellow-800 font-medium">No Resume Uploaded</p>
        <p className="text-xs text-yellow-700">
          Please upload a resume in the Resumes page to generate personalized content.
        </p>
      </div>
    </div>
  );
}
