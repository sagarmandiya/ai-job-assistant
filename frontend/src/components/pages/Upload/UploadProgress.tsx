import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2, Clock, Zap } from "lucide-react";

interface ProcessingStage {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  estimatedDuration: number;
}

interface UploadProgressProps {
  uploading: boolean;
  currentUpload: File | null;
  processingStages: ProcessingStage[];
  currentStageIndex: number;
  overallProgress: number;
  uploadProgress: string;
}

export function UploadProgress({
  uploading,
  currentUpload,
  processingStages,
  currentStageIndex,
  overallProgress,
  uploadProgress
}: UploadProgressProps) {
  if (!uploading || !currentUpload) return null;

  const currentStage = processingStages[currentStageIndex];
  const completedStages = processingStages.filter(stage => stage.completed);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Resume
            </CardTitle>
            <CardDescription>
              {currentUpload.name} • {(currentUpload.size / 1024 / 1024).toFixed(1)}MB
            </CardDescription>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {Math.ceil((100 - overallProgress) / 10)}s remaining
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Current Stage */}
        {currentStage && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{currentStage.name}</h4>
              <Badge variant="outline" className="text-xs">
                {currentStage.estimatedDuration / 1000}s
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{uploadProgress}</p>
          </div>
        )}

        {/* Processing Stages */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Processing Steps</h4>
          <div className="space-y-2">
            {processingStages.map((stage, index) => (
              <div
                key={stage.id}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  index === currentStageIndex
                    ? 'bg-primary/10 border border-primary/20'
                    : stage.completed
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-muted/50'
                }`}
              >
                <div className="flex-shrink-0">
                  {stage.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : index === currentStageIndex ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    index === currentStageIndex ? 'text-primary' : 
                    stage.completed ? 'text-green-700' : 'text-muted-foreground'
                  }`}>
                    {stage.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {stage.description}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {stage.estimatedDuration / 1000}s
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4" />
            <span>{completedStages.length} of {processingStages.length} steps completed</span>
          </div>
          <Badge variant="outline">
            {Math.round(overallProgress)}% Complete
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
