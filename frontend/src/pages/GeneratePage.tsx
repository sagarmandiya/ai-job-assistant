import { GenerationTabs } from "@/components/pages/Generate/GenerationTabs";
import { ResumeWarning } from "@/components/pages/Generate/ResumeWarning";
import { GenerationForm } from "@/components/pages/Generate/GenerationForm";
import { GeneratedContent } from "@/components/pages/Generate/GeneratedContent";
import { useGenerate } from "@/hooks/use-generate";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function GeneratePage() {
  const {
    activeTab,
    jobDescription,
    additionalContext,
    generatedContent,
    subjectLines,
    isGenerating,
    isSavingJob,
    setJobDescription,
    setAdditionalContext,
    handleSaveJobDescription,
    handleGenerate,
    handleCopy,
    handleDownload,
    handleTabChange,
    checkResumeStatus
  } = useGenerate();

  const hasResume = checkResumeStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Breadcrumb className="mb-4" />
        <h1 className="text-3xl font-bold tracking-tight">Content Generation</h1>
        <p className="text-muted-foreground">
          Generate personalized cover letters and professional outreach emails
        </p>
      </div>

      {/* Resume Status Warning */}
      <ResumeWarning hasResume={hasResume} />

      {/* Tab Navigation */}
      <GenerationTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generation Form */}
        <GenerationForm
          activeTab={activeTab}
          jobDescription={jobDescription}
          additionalContext={additionalContext}
          isGenerating={isGenerating}
          isSavingJob={isSavingJob}
          hasResume={hasResume}
          onJobDescriptionChange={setJobDescription}
          onAdditionalContextChange={setAdditionalContext}
          onSaveJobDescription={handleSaveJobDescription}
          onGenerate={handleGenerate}
        />

        {/* Generated Content */}
        <GeneratedContent
          activeTab={activeTab}
          generatedContent={generatedContent}
          subjectLines={subjectLines}
          hasResume={hasResume}
          onCopy={handleCopy}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
}
