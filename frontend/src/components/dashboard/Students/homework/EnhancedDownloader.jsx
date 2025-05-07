import React, { useState } from "react";
import { MdDownload, MdCheckCircle, MdError, MdFilePresent } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
   getDownloadFileName,
   getDownloadUrl,
   getFileTypeIcon,
   getFileTypeDescription
} from "../../../../utils/fileUtils";

/**
 * Enhanced file downloader with download progress, status indicators, and file info
 *
 * @param {Object} props
 * @param {string} props.fileUrl - URL of the file to download
 * @param {string} props.title - Title to use for the filename
 * @param {string} props.buttonText - Text to display on the button
 * @param {string} props.className - Custom CSS class
 * @param {boolean} props.icon - Whether to show only an icon (no text)
 * @param {boolean} props.showProgress - Whether to show download progress
 * @param {boolean} props.showFileInfo - Whether to show file information
 * @param {Function} props.onComplete - Callback when download completes
 */
function EnhancedDownloader({
   fileUrl,
   title = "file",
   buttonText = "Download",
   className = "",
   icon = false,
   showProgress = true,
   showFileInfo = false,
   onComplete = null
}) {
   const [downloadState, setDownloadState] = useState("idle"); // idle, downloading, success, error
   const [progress, setProgress] = useState(0);
   const [errorMessage, setErrorMessage] = useState("");

   const handleDownload = async () => {
      if (!fileUrl) {
         setErrorMessage("No file URL provided");
         setDownloadState("error");
         setTimeout(() => setDownloadState("idle"), 3000);
         return;
      }

      try {
         setDownloadState("downloading");
         setProgress(0);

         // Fetch the file
         const response = await fetch(getDownloadUrl(fileUrl));
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         // Read the response as a Blob
         const blob = await response.blob();
         const fileName = getDownloadFileName(title, fileUrl);

         // Create a temporary anchor element to trigger the download
         const link = document.createElement("a");
         link.href = URL.createObjectURL(blob);
         link.download = fileName;
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);

         // Clean up the object URL
         URL.revokeObjectURL(link.href);

         setProgress(100);
         setDownloadState("success");
         if (onComplete) onComplete(true);
         setTimeout(() => setDownloadState("idle"), 3000);
      } catch (error) {
         console.error("Download failed:", error);
         setErrorMessage(error.message || "Download failed");
         setDownloadState("error");
         if (onComplete) onComplete(false, error);
         setTimeout(() => setDownloadState("idle"), 3000);
      }
   };

   // Render file info section if enabled
   const renderFileInfo = () => {
      if (!showFileInfo || !fileUrl) return null;

      const fileType = getFileTypeDescription(fileUrl);
      const iconType = getFileTypeIcon(fileUrl);

      return (
         <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <MdFilePresent className="text-gray-500" />
            <span>{fileType}</span>
         </div>
      );
   };

   const getButtonContent = () => {
      // Icon-only mode
      if (icon) {
         switch (downloadState) {
            case "downloading":
               return <AiOutlineLoading3Quarters className="animate-spin" />;
            case "success":
               return <MdCheckCircle className="text-green-500" />;
            case "error":
               return <MdError className="text-red-500" />;
            default:
               return <MdDownload />;
         }
      }

      // Full button mode
      switch (downloadState) {
         case "downloading":
            return (
               <>
                  {showProgress ? (
                     <div className="flex items-center gap-2">
                        <AiOutlineLoading3Quarters className="animate-spin" />
                        <span>{progress}%</span>
                     </div>
                  ) : (
                     <div className="flex items-center gap-2">
                        <AiOutlineLoading3Quarters className="animate-spin" />
                        <span>Downloading...</span>
                     </div>
                  )}
               </>
            );
         case "success":
            return (
               <div className="flex items-center gap-2">
                  <MdCheckCircle />
                  <span>Downloaded</span>
               </div>
            );
         case "error":
            return (
               <div className="flex items-center gap-2">
                  <MdError />
                  <span>Failed{errorMessage ? `: ${errorMessage}` : ""}</span>
               </div>
            );
         default:
            return (
               <div className="flex items-center gap-2">
                  <MdDownload />
                  <span>{buttonText}</span>
               </div>
            );
      }
   };

   // Determine appropriate styling based on state
   const baseClasses = "transition-all duration-200 flex items-center justify-center";
   const stateClasses = {
      idle: "bg-medium-gray hover:bg-charcoal-gray text-white",
      downloading: "bg-blue-600 cursor-wait text-white",
      success: "bg-green-600 text-white",
      error: "bg-red-600 text-white"
   };

   // Determine size/shape classes
   const sizeClasses = icon
      ? "w-12 h-12 rounded-full"
      : "py-3 px-4 rounded-lg font-medium text-sm gap-2";

   const buttonClasses = className || `${baseClasses} ${sizeClasses} ${stateClasses[downloadState]}`;

   // Progress bar component
   const renderProgressBar = () => {
      if (!showProgress || downloadState !== "downloading") return null;

      return (
         <div className="w-full bg-gray-200 rounded-full h-1 mt-1 overflow-hidden">
            <div
               className="bg-blue-600 h-1 transition-all duration-300 ease-out"
               style={{ width: `${progress}%` }}
            ></div>
         </div>
      );
   };

   return (
      <div className="w-full">
         {renderFileInfo()}
         <button
            onClick={handleDownload}
            className={buttonClasses}
            disabled={downloadState !== "idle"}
            title={fileUrl ? `Download ${title || "file"}` : "No file available"}
         >
            {getButtonContent()}
         </button>
         {renderProgressBar()}
      </div>
   );
}

export default EnhancedDownloader;