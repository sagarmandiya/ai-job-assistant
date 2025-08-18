import { ReactNode } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Fallback renderer that handles basic markdown without external dependencies
export const MarkdownRenderer = ({ content, className = "" }: MarkdownRendererProps) => {
  try {
    // Simple markdown parsing for bold text
    const renderBoldText = (text: string): ReactNode[] => {
      const parts = text.split(/(\*\*.*?\*\*)/g);
      
      return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          return <strong key={index} className="font-semibold">{boldText}</strong>;
        }
        return <span key={index}>{part}</span>;
      });
    };

    // Split content by newlines and render each line
    const lines = content.split('\n');
    
    return (
      <div className={`markdown-content ${className}`}>
        {lines.map((line, index) => {
          // Handle bullet points
          if (line.trim().startsWith('- ')) {
            const bulletContent = line.trim().substring(2);
            return (
              <div key={index} className="flex items-start gap-2 mb-1">
                <span className="text-xs mt-1">•</span>
                <span className="flex-1">{renderBoldText(bulletContent)}</span>
              </div>
            );
          }
          
          // Handle regular paragraphs
          if (line.trim()) {
            return (
              <p key={index} className="mb-2">
                {renderBoldText(line)}
              </p>
            );
          }
          
          // Handle empty lines
          return <br key={index} />;
        })}
      </div>
    );
  } catch (error) {
    console.error('MarkdownRenderer error:', error);
    // Fallback to plain text if markdown parsing fails
    return (
      <div className={`fallback-content ${className}`}>
        {content}
      </div>
    );
  }
};
