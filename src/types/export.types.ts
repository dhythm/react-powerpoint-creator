export interface ExportOptions {
  format: 'pptx' | 'pdf' | 'png';
  quality?: 'low' | 'medium' | 'high';
  includeAnimations?: boolean;
  includeNotes?: boolean;
}

export interface ExportProgress {
  status: 'idle' | 'preparing' | 'exporting' | 'complete' | 'error';
  progress: number; // 0-100
  message?: string;
  error?: Error;
}