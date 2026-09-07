// src/lib/file-action-utils.ts
//
// FIX-24: thin compatibility wrapper — all real logic lives in
// src/lib/file-actions.ts (the single shared download/share implementation).
// Kept only so existing `{ url, filename, ... }`-style call sites don't need
// to change their import shape.
import {
  downloadFile as coreDownloadFile,
  shareFile as coreShareFile,
  type FileActionSource,
} from "./file-actions";

export interface FileActionOptions {
  url: string;
  filename: string;
  title?: string;
  text?: string;
  mimeType?: string;
}

function toSource(options: FileActionOptions): FileActionSource {
  return {
    url: options.url,
    fileName: options.filename,
    title: options.title,
    text: options.text,
    mimeType: options.mimeType,
  };
}

export async function downloadFile(options: FileActionOptions): Promise<void> {
  return coreDownloadFile(toSource(options));
}

export async function shareFile(options: FileActionOptions): Promise<void> {
  return coreShareFile(toSource(options));
}
