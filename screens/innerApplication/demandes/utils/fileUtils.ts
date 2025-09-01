export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith("image/")) return "file-image-o";
  if (mimeType === "application/pdf") return "file-pdf-o";
  if (mimeType.includes("document")) return "file-text";
  return "file-o";
};
