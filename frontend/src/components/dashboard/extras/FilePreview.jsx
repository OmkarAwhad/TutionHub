import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { FaDownload, FaExpand, FaCompress, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

function DocumentPreview({ fileUrl, fileName, fileType, onClose }) {
   const [isFullscreen, setIsFullscreen] = useState(false);
   const [numPages, setNumPages] = useState(null);
   const [pageNumber, setPageNumber] = useState(1);
   const [detectedFileType, setDetectedFileType] = useState('');
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');

   // Detect file type from URL if not provided
   useEffect(() => {
      if (fileType) {
         setDetectedFileType(fileType);
      } else if (fileUrl) {
         const extension = fileUrl.split('.').pop()?.toLowerCase();
         
         const typeMap = {
            'pdf': 'application/pdf',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
         };
         
         setDetectedFileType(typeMap[extension] || 'unknown');
      }
      setLoading(false);
   }, [fileType, fileUrl]);

   // Handle ESC key to close modal
   useEffect(() => {
      const handleEscape = (e) => {
         if (e.key === 'Escape' && onClose) {
            onClose();
         }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
   }, [onClose]);

   const handleDownload = async () => {
      try {
         const response = await fetch(fileUrl);
         
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }
         
         const blob = await response.blob();
         const url = window.URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.download = fileName || 'download';
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         window.URL.revokeObjectURL(url);
         toast.success('File downloaded successfully');
      } catch (error) {
         console.error('Download error:', error);
         toast.error('Failed to download file');
      }
   };

   const renderPreview = () => {
      if (!detectedFileType) {
         return (
            <div className="flex items-center justify-center h-full text-white">
               <p>Unable to detect file type</p>
            </div>
         );
      }

      // Handle PDF files
      if (detectedFileType === 'application/pdf') {
         return (
            <div className="pdf-container h-full flex flex-col items-center">
               <Document
                  file={fileUrl}
                  onLoadSuccess={({ numPages }) => {
                     setNumPages(numPages);
                     setLoading(false);
                  }}
                  onLoadError={(error) => {
                     console.error('PDF load error:', error);
                     setError('Failed to load PDF');
                     setLoading(false);
                  }}
                  className="flex justify-center"
                  loading={
                     <div className="flex items-center justify-center h-64 text-white">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                     </div>
                  }
               >
                  <Page
                     pageNumber={pageNumber}
                     width={Math.min(window.innerWidth * 0.8, 800)}
                     className="shadow-lg"
                     onLoadError={(error) => {
                        console.error('Page load error:', error);
                        setError('Failed to load PDF page');
                     }}
                  />
               </Document>

               {numPages && numPages > 1 && (
                  <div className="flex items-center justify-center mt-6 gap-4">
                     <button
                        onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                        disabled={pageNumber <= 1}
                        className="px-4 py-2 bg-white text-charcoal-gray rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                     >
                        Previous
                     </button>

                     <span className="text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                        Page {pageNumber} of {numPages}
                     </span>

                     <button
                        onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                        disabled={pageNumber >= numPages}
                        className="px-4 py-2 bg-white text-charcoal-gray rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                     >
                        Next
                     </button>
                  </div>
               )}
            </div>
         );
      }

      // Handle images
      if (detectedFileType && detectedFileType.startsWith('image/')) {
         return (
            <div className="flex items-center justify-center h-full p-4">
               <img
                  src={fileUrl}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  onLoad={() => setLoading(false)}
                  onError={() => {
                     setError('Failed to load image');
                     setLoading(false);
                  }}
                  style={{ 
                     maxHeight: '90vh',
                     maxWidth: '90vw'
                  }}
               />
            </div>
         );
      }

      // Handle Word documents
      if (detectedFileType.includes('word') || detectedFileType.includes('document')) {
         return (
            <div className="w-full h-full p-4">
               <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
                  className="w-full h-full border-0 rounded-lg shadow-lg"
                  title="Document Preview"
                  onLoad={() => setLoading(false)}
                  onError={() => {
                     setError('Failed to load document preview');
                     setLoading(false);
                  }}
               />
            </div>
         );
      }

      // Fallback for other file types
      return (
         <div className="flex flex-col items-center justify-center h-full text-white">
            <div className="text-8xl mb-6">📄</div>
            <p className="text-xl mb-4">Preview not available for this file type</p>
            <p className="text-lg mb-6 opacity-75">File type: {detectedFileType}</p>
            <button
               onClick={handleDownload}
               className="px-6 py-3 bg-white text-charcoal-gray rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
               Download to view
            </button>
         </div>
      );
   };

   if (error) {
      return (
         <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="flex flex-col items-center justify-center text-white">
               <div className="text-red-400 text-8xl mb-6">⚠️</div>
               <p className="text-xl mb-6">{error}</p>
               <div className="flex gap-4">
                  <button
                     onClick={handleDownload}
                     className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                     Download Instead
                  </button>
                  {onClose && (
                     <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                     >
                        Close
                     </button>
                  )}
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="fixed inset-0 bg-black bg-opacity-95 flex flex-col z-50">
         {/* Header with controls */}
         <div className="flex items-center justify-between p-4 bg-black bg-opacity-50">
            <h3 className="text-xl font-semibold text-white truncate flex-1 mr-4">
               {fileName || 'Document Preview'}
            </h3>

            <div className="flex items-center gap-3">
               <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-charcoal-gray cursor-pointer rounded-lg hover:bg-opacity-30 transition-all duration-200"
                  title="Download"
               >
                  <FaDownload />
                  <span className="hidden sm:inline">Download</span>
               </button>

               {onClose && (
                  <button
                     onClick={onClose}
                     className="flex items-center gap-2 px-4 py-2 bg-red-500 bg-opacity-80 cursor-pointer text-white rounded-lg hover:bg-opacity-100 transition-all duration-200"
                     title="Close"
                  >
                     <FaTimes />
                     <span className="hidden sm:inline">Close</span>
                  </button>
               )}
            </div>
         </div>

         {/* Preview content */}
         <div className="flex-1 relative">
            {loading && (
               <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                  <div className="text-center text-white">
                     <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                     <p className="text-lg">Loading preview...</p>
                  </div>
               </div>
            )}
            
            <div className="w-full h-full">
               {renderPreview()}
            </div>
         </div>
      </div>
   );
}

export default DocumentPreview;
