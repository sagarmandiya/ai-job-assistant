// frontend/src/types/global.d.ts
declare global {
  interface Window {
    addToLibrary: (
      type: "cover-letter" | "outreach-email",
      jobTitle: string,
      company: string,
      content: string,
      subjectLines?: string[]
    ) => string;
  }
}

export {};
