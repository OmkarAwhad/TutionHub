import React, { useState, useRef } from "react";
import {
   MdUploadFile,
   MdCheckCircle,
   MdError,
   MdClose,
   MdDelete
} from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getFileTypeDescription, formatFileSize } from "../../../../utils/fileUtils";

/**
 * Enhanced file uploader with drag and drop, progress tracking, and file validation
 * 
 * @param {Object} props
 * @param {Function} props.onFileSelect - Callback when a file is selected
 * @param {Function} props.onUpload - Callback to handle the upload
 * @param {string} props.title - Title text
 * @param {Array} props.acceptedFileTypes - Array of accepted file types (e.g. ['.pdf', '.doc'])
 * @param {number} props.maxSizeMB - Maximum file size in MB
 * @param {boolean} props.disabled - Whether the uploader is disabled
 * @param {string} props.className - Additional CSS classes
 */
function EnhancedFileUploader({
   onFileSelect = () => { },
   onUpload = null,
   title = "Upload File",
   acceptedFileTypes = null,
   maxSizeMB = 10,
   disabled = false,
   className = ""
}) {
   const [file, setFile] = useState(null);
   const [isDragging, setIsDragging] = useState(false);
   const [uploadState, setUploadState] = useState("idle"); // idle, uploading, success, error
   const [progress, setProgress] = useState(0);
   const [errorMessage, setErrorMessage] = useState("");
   const fileInputRef = useRef(null);

   // Format accepted file types for display
   const formatAcceptedTypes = () => {
      if (!acceptedFileTypes || acceptedFileTypes.length === 0) {
         return "All files";
      }

      return acceptedFileTypes
         .map(type => type.replace(".", "").toUpperCase())
         .join(", ");
   };

   // Convert accepted file types to accept attribute format
   const formatAcceptAttribute = () => {
      if (!acceptedFileTypes || acceptedFileTypes.length === 0) {
         return undefined;
      }

      return acceptedFileTypes.join(",");
   };

   // Handle file selection
   const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      validateAndSetFile(selectedFile);
   };

   // Validate and set file
   const validateAndSetFile = (selectedFile) => {
      if (!selectedFile) return;

      // Reset states
      setErrorMessage("");

      // Check file size
      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
         setErrorMessage(`File size exceeds ${maxSizeMB}MB limit`);
         return;
      }

      // Check file type if restrictions exist
      if (acceptedFileTypes && acceptedFileTypes.length > 0) {
         const fileExtension = `.${selectedFile.name.split('.').pop().toLowerCase()}`;
         if (!acceptedFileTypes.includes(fileExtension)) {
            setErrorMessage(`Invalid file type. Accepted: ${formatAcceptedTypes()}`);
            return;
         }
      }

      // Set file if valid
      setFile(selectedFile);
      onFileSelect(selectedFile);
   };

   // Handle drag events
   const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setIsDragging(true);
   };

   const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
   };

   const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setIsDragging(true);
   };

   const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
         validateAndSetFile(e.dataTransfer.files[0]);
      }
   };

   // Clear selected file
   const handleClearFile = () => {
      setFile(null);
      setErrorMessage("");
      if (fileInputRef.current) {
         fileInputRef.current.value = '';
      }
      onFileSelect(null);
   };

   // Handle upload
   const handleUpload = async () => {
      // console.log("Selected file:", file);
      if (!file || !onUpload) return;

      try {
         setUploadState("uploading");
         setProgress(0);

         // Use a custom progress tracker
         const trackProgress = (progressEvent) => {
            const percentCompleted = Math.round(
               (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
         };

         // Call the provided upload function
         const result = await onUpload(file, trackProgress);

         setProgress(100);
         setUploadState("success");

         // Reset after success
         setTimeout(() => {
            setUploadState("idle");
            // Optionally clear the file after successful upload
            // handleClearFile();
         }, 3000);

         return result;
      } catch (error) {
         console.error("Upload failed:", error);
         setErrorMessage(error.message || "Upload failed");
         setUploadState("error");

         // Reset after error
         setTimeout(() => {
            setUploadState("idle");
         }, 3000);

         throw error;
      }
   };

   return (
      <div className={`w-full ${className}`}>
         {title && <h3 className="text-sm font-medium mb-2">{title}</h3>}

         {/* Error message */}
         {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-3 flex justify-between items-center">
               <span>{errorMessage}</span>
               <MdClose
                  className="cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => setErrorMessage("")}
               />
            </div>
         )}

         {/* File drag & drop area */}
         <div
            className={`
          border-2 ${isDragging ? 'border-medium-gray bg-gray-50' : 'border-dashed border-gray-300'} 
          rounded-lg p-6 transition-all duration-200
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-medium-gray cursor-pointer'}
        `}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !disabled && !file && fileInputRef.current?.click()}
         >
            <input
               type="file"
               ref={fileInputRef}
               onChange={handleFileChange}
               className="hidden"
               accept={formatAcceptAttribute()}
               disabled={disabled}
            />

            {!file ? (
               // Empty state
               <div className="flex flex-col items-center justify-center">
                  <MdUploadFile className="text-4xl text-medium-gray mb-2" />
                  <p className="text-sm font-medium">
                     {isDragging ? "Drop file here" : "Click or drag file to upload"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                     {acceptedFileTypes && acceptedFileTypes.length > 0
                        ? `Accepted file types: ${formatAcceptedTypes()}`
                        : "All file types accepted"}
                  </p>
                  <p className="text-xs text-gray-500">
                     Max file size: {maxSizeMB}MB
                  </p>
               </div>
            ) : (
               // File selected state
               <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                     <div className="bg-gray-100 p-2 rounded">
                        <MdUploadFile className="text-xl text-medium-gray" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                           {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                           {getFileTypeDescription(file.name)} • {formatFileSize(file.size)}
                        </p>
                     </div>
                  </div>

                  <button
                     type="button"
                     onClick={(e) => {
                        e.stopPropagation();
                        handleClearFile();
                     }}
                     className="text-gray-400 hover:text-gray-600"
                     disabled={disabled || uploadState === "uploading"}
                  >
                     <MdDelete className="text-xl" />
                  </button>
               </div>
            )}
         </div>

         {/* File upload button - only show if file is selected and onUpload is provided */}
         {file && onUpload && (
            <div className="mt-4">
               <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!file || uploadState === "uploading" || disabled}
                  className={`
               w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200
               ${!file || uploadState === "uploading" || disabled
                        ? "bg-gray-300 cursor-not-allowed text-gray-600"
                        : "bg-medium-gray text-white hover:bg-charcoal-gray"}
            `}
               >
                  {uploadState === "uploading" && (
                     <>
                        <AiOutlineLoading3Quarters className="animate-spin" />
                        <span>Uploading... {progress}%</span>
                     </>
                  )}
                  {uploadState === "success" && (
                     <>
                        <MdCheckCircle />
                        <span>Upload Complete</span>
                     </>
                  )}
                  {uploadState === "error" && (
                     <>
                        <MdError />
                        <span>Upload Failed</span>
                     </>
                  )}
                  {uploadState === "idle" && (
                     <>
                        <MdUploadFile />
                        <span>Upload File</span>
                     </>
                  )}
               </button>

               {/* Progress bar */}
               {uploadState === "uploading" && (
                  <div className="w-full h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                     <div
                        className="h-full bg-medium-gray transition-all duration-300"
                        style={{ width: `${progress}%` }}
                     ></div>
                  </div>
               )}
            </div>
         )}
      </div>
   );
}

export default EnhancedFileUploader;