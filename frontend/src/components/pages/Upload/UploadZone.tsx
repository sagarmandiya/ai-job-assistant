import { useCallback, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle } from "lucide-react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  dragActive: boolean;
  setDragActive: (active: boolean) => void;
}

export function UploadZone({ onFileSelect, isUploading, dragActive, setDragActive }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, [setDragActive]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect, setDragActive]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const isValidFile = (file: File): boolean => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or Word document (.pdf, .doc, .docx)');
      return false;
    }
    
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return false;
    }
    
    return true;
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className={`border-2 border-dashed transition-colors ${
      dragActive 
        ? 'border-primary bg-primary/5' 
        : 'border-muted-foreground/25 hover:border-primary/50'
    }`}>
      <CardContent className="p-8">
        <div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            dragActive ? 'bg-primary/10' : 'bg-muted'
          }`}>
            <Upload className={`w-8 h-8 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {dragActive ? 'Drop your resume here' : 'Upload your resume'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Drag and drop your resume file here, or click to browse. 
              Supports PDF and Word documents up to 10MB.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>PDF, DOC, DOCX</span>
            <span>•</span>
            <span>Max 10MB</span>
          </div>

          <Button
            onClick={openFileDialog}
            disabled={isUploading}
            className="mt-4"
          >
            {isUploading ? 'Uploading...' : 'Choose File'}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileInput}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
