/**
 * Utility functions for handling file operations, especially with Cloudinary URLs
 */

/**
 * Extracts file extension from a URL, handling Cloudinary URLs better
 * @param {string} url - The file URL
 * @returns {string} - The file extension or default "pdf"
 */
export const getFileExtension = (url) => {
   if (!url) return "pdf";
   
   try {
      // For Cloudinary URLs, handle different formats
      if (url.includes("cloudinary.com")) {
         // Pattern 1: Look for extension in the public_id part
         const match = url.match(/\/([^/]+)\.(pdf|doc|docx|jpg|jpeg|png|gif|txt|csv|zip|rar|mp3|mp4|mov|ppt|pptx|xls|xlsx)(?:[?#]|$)/i);
         if (match) {
            return match[2].toLowerCase();
         }
         
         // Pattern 2: Look for file format in URL parameters
         const formatMatch = url.match(/[?&]format=([^&]+)/i);
         if (formatMatch) {
            return formatMatch[1].toLowerCase();
         }
         
         // Pattern 3: Extract from the end of public_id before any transformations
         const publicIdMatch = url.match(/\/v\d+\/[^/]*\.([a-zA-Z0-9]+)(?:[/?]|$)/);
         if (publicIdMatch) {
            return publicIdMatch[1].toLowerCase();
         }
      }
      
      // For regular URLs
      const extensionMatch = url.match(/\.([^./\?#]+)(?:\?.*)?(?:#.*)?$/);
      return extensionMatch ? extensionMatch[1].toLowerCase() : "pdf";
   } catch (error) {
      console.error("Error extracting file extension:", error);
      return "pdf";
   }
};

/**
 * Creates a proper download URL for Cloudinary files
 * @param {string} url - The original URL
 * @param {string} fileName - Optional filename for attachment
 * @returns {string} - Modified URL for download
 */
export const getDownloadUrl = (url, fileName = null) => {
   if (!url) return null;
   
   try {
      if (url.includes("cloudinary.com")) {
         // Remove any existing transformations that might interfere
         let cleanUrl = url;
         
         // Find the upload part and rebuild with download transformation
         const uploadMatch = url.match(/(.*\/upload\/)(.*)$/);
         if (uploadMatch) {
            const baseUrl = uploadMatch[1];
            const resourcePath = uploadMatch[2];
            
            // Build download URL with proper transformations
            const downloadTransformations = [
               'fl_attachment',
               fileName ? `fl_attachment:${encodeURIComponent(fileName)}` : null
            ].filter(Boolean).join(',');
            
            cleanUrl = `${baseUrl}${downloadTransformations}/${resourcePath}`;
         }
         
         return cleanUrl;
      }
      
      return url;
   } catch (error) {
      console.error("Error processing download URL:", error);
      return url;
   }
};
/**
 * Check if a file type can be previewed
 * @param {string} url - File URL
 * @returns {boolean} - Whether the file can be previewed
 */
export const canPreviewFile = (url) => {
   if (!url) return false;
   
   const extension = getFileExtension(url);
   const previewableTypes = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'txt', 'doc', 'docx'];
   
   return previewableTypes.includes(extension);
};

/**
 * Get preview URL with proper transformations for Cloudinary
 * @param {string} url - Original file URL
 * @returns {string} - Preview-optimized URL
 */
export const getPreviewUrl = (url) => {
   if (!url) return null;
   
   try {
      if (url.includes("cloudinary.com")) {
         // For images, add quality optimization
         const extension = getFileExtension(url);
         if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
            const uploadMatch = url.match(/(.*\/upload\/)(.*)$/);
            if (uploadMatch) {
               const baseUrl = uploadMatch[1];
               const resourcePath = uploadMatch[2];
               return `${baseUrl}q_auto,f_auto/${resourcePath}`;
            }
         }
      }
      
      return url;
   } catch (error) {
      console.error("Error processing preview URL:", error);
      return url;
   }
};

/**
 * Enhanced download function with multiple fallback methods
 * @param {string} url - The file URL
 * @param {string} fileName - The suggested filename
 * @returns {Promise<boolean>} - Whether download was successful
 */
export const downloadFile = async (url, fileName) => {
   if (!url) {
      console.error("No URL provided for download");
      return false;
   }

   const finalFileName = fileName || getDownloadFileName("document", url);

   try {
      // Method 1: Blob download for better control
      const response = await fetch(url, {
         method: 'GET',
         headers: {
            'Accept': 'application/octet-stream, application/pdf, */*'
         }
      });

      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Force download using blob URL
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = finalFileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      setTimeout(() => {
         window.URL.revokeObjectURL(blobUrl);
      }, 100);
      
      return true;
   } catch (error) {
      console.warn("Blob download failed, trying direct download:", error);
      
      try {
         // Method 2: Direct download with Cloudinary transformations
         const downloadUrl = getDownloadUrl(url, finalFileName);
         const link = document.createElement("a");
         link.href = downloadUrl;
         link.download = finalFileName;
         link.target = '_blank';
         
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         
         return true;
      } catch (directError) {
         console.error("All download methods failed:", directError);
         
         // Method 3: Last resort - open in new tab
         try {
            window.open(url, '_blank');
            return true;
         } catch (openError) {
            console.error("Failed to open file:", openError);
            return false;
         }
      }
   }
};

/**
 * Generates a clean file name for download
 * @param {string} title - The title to use for the filename
 * @param {string} url - The file URL to extract extension from
 * @returns {string} - A formatted filename with extension
 */
export const getDownloadFileName = (title, url) => {
   const extension = getFileExtension(url);
   
   let cleanTitle = title;
   if (!cleanTitle || cleanTitle.trim() === '') {
      cleanTitle = "document";
   }
   
   // Clean the title to make it filename-safe
   cleanTitle = cleanTitle
      .trim()
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, '') // Remove invalid characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/_{2,}/g, '_') // Replace multiple underscores
      .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
      .substring(0, 100); // Limit length
   
   return `${cleanTitle}.${extension}`;
};

/**
 * Maps file extensions to user-friendly descriptions
 * @param {string} url - The file URL to analyze
 * @returns {string} - A user-friendly file type description
 */
export const getFileTypeDescription = (url) => {
   const extension = getFileExtension(url);

   const typeMap = {
      pdf: "PDF Document",
      doc: "Word Document",
      docx: "Word Document",
      xls: "Excel Spreadsheet",
      xlsx: "Excel Spreadsheet",
      ppt: "PowerPoint Presentation",
      pptx: "PowerPoint Presentation",
      jpg: "Image",
      jpeg: "Image",
      png: "Image",
      gif: "Image",
      webp: "Image",
      svg: "Image",
      txt: "Text Document",
      csv: "CSV Spreadsheet",
      zip: "ZIP Archive",
      rar: "RAR Archive",
      mp3: "Audio File",
      mp4: "Video File",
      mov: "Video File",
      avi: "Video File",
   };

   return typeMap[extension] || `${extension.toUpperCase()} File`;
};

/**
 * Gets appropriate icon class based on file type
 * @param {string} url - The file URL
 * @returns {string} - Icon class name for the file type
 */
export const getFileTypeIcon = (url) => {
   const extension = getFileExtension(url);

   const iconMap = {
      // Documents
      pdf: "file-pdf",
      doc: "file-word",
      docx: "file-word",
      txt: "file-text",

      // Spreadsheets
      xls: "file-excel",
      xlsx: "file-excel",
      csv: "file-csv",

      // Presentations
      ppt: "file-powerpoint",
      pptx: "file-powerpoint",

      // Images
      jpg: "file-image",
      jpeg: "file-image",
      png: "file-image",
      gif: "file-image",
      svg: "file-image",
      webp: "file-image",

      // Archives
      zip: "file-archive",
      rar: "file-archive",
      tar: "file-archive",
      gz: "file-archive",

      // Media
      mp3: "file-audio",
      wav: "file-audio",
      mp4: "file-video",
      mov: "file-video",
      avi: "file-video",

      // Code
      html: "file-code",
      css: "file-code",
      js: "file-code",
      json: "file-code",
      xml: "file-code",
      py: "file-code",
      java: "file-code",
   };

   return iconMap[extension] || "file";
};

/**
 * Check if a URL is valid
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export const isValidUrl = (url) => {
   if (!url) return false;
   try {
      new URL(url);
      return true;
   } catch (e) {
      return false;
   }
};

/**
 * Check if file is an image based on URL
 * @param {string} url - File URL to check
 * @returns {boolean} - Whether the file is likely an image
 */
export const isImageFile = (url) => {
   if (!url) return false;
   const ext = getFileExtension(url);
   return ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"].includes(ext);
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size with units
 */
export const formatFileSize = (bytes) => {
   if (bytes === 0) return "0 Bytes";
   if (!bytes || isNaN(bytes)) return "Unknown size";

   const k = 1024;
   const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
   const i = Math.floor(Math.log(bytes) / Math.log(k));

   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Extract a readable filename from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} - Extracted filename
 */
export const extractCloudinaryFileName = (url) => {
   if (!url || !url.includes('cloudinary.com')) {
      return 'document';
   }
   
   try {
      // Pattern to match Cloudinary file URLs
      const match = url.match(/\/v\d+\/([^/]+)(?:\.[^.]+)?$/);
      if (match) {
         return match[1].replace(/[^a-zA-Z0-9_-]/g, '_');
      }
      return 'document';
   } catch (error) {
      console.error('Error extracting Cloudinary filename:', error);
      return 'document';
   }
};
