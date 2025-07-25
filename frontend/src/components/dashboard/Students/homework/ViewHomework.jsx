import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdAssignment } from "react-icons/md";
import {
   submitHomework,
   HWSubmittedByStud,
} from "../../../../services/operations/homework.service";
import toast from "react-hot-toast";
import { getFileTypeDescription } from "../../../../utils/fileUtils";
import EnhancedDownloader from "./EnhancedDownloader";
import EnhancedFileUploader from "./EnhancedFileUploader";
import { useDispatch, useSelector } from "react-redux";

function ViewHomework() {
   const { state } = useLocation();
   const navigate = useNavigate();
   const homework = state?.homework || {};
   const [submission, setSubmission] = useState(null);
   const { token } = useSelector((state) => state.auth);

   const dispatch = useDispatch();

   useEffect(() => {
      const fetchSubmission = async () => {
         try {
            const response = await dispatch(HWSubmittedByStud(token));
            const submissions = response?.homework || [];
            const submittedHomework = submissions.find((sub) => sub._id === homework._id);
            if (submittedHomework) {
               setSubmission(submittedHomework);
            }
         } catch (error) {
            console.error("Error fetching submission:", error);
         }
      };

      fetchSubmission();
   }, [dispatch, token, homework._id]);

   const handleFileSelect = (file) => {
      // This is just for any client-side validation or state you want to track
      // The actual file object is handled by EnhancedFileUploader
   };

   const handleUpload = async (file, trackProgress) => {
      if (!file) {
         toast.error("Please select a file to upload.");
         return;
      }

      try {
         // Create form data
         const formData = new FormData();
         formData.append("homeworkId", homework._id);
         formData.append("file", file);

         // Submit homework
         const response = await dispatch(submitHomework(formData, token));

         if (response) {
            toast.success("Homework submitted successfully!");
            setSubmission(response); // Update submission state
            return response;
         } else {
            throw new Error("Failed to submit homework");
         }
      } catch (error) {
         console.error("Error during homework submission:", error);
         toast.error(error.message || "An error occurred during submission.");
         throw error;
      }
   };

   const formatDueDate = (dateString) => {
      if (!dateString) return "N/A";

      const date = new Date(dateString);

      // Format: May 15, 2023
      return date.toLocaleDateString("en-US", {
         year: "numeric",
         month: "long",
         day: "numeric",
      });
   };

   return (
      <div className="px-4 sm:px-6 mx-auto max-w-4xl">
         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
               <MdAssignment className="text-medium-gray" />
               View Homework
            </h3>
            <button
               onClick={() => navigate(-1)}
               className="flex items-center gap-2 py-2 px-4 transition-all duration-200 self-start sm:self-auto"
            >
               <FaArrowLeftLong className="text-base sm:text-lg" />
               Back
            </button>
         </div>

         <div className="shadow-lg rounded-xl border border-gray-200 px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6">
            {/* Homework header section */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
               <div className="space-y-2 sm:space-y-3 flex-1">
                  <h3 className="text-xl sm:text-2xl font-semibold">
                     {homework.title || "Untitled Homework"}
                  </h3>
                  <p className="text-lg sm:text-xl text-slate-gray">
                     {homework.subject?.name || "No Subject"}{" "}
                     {homework.subject?.code ? `(${homework.subject.code})` : ""}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-1 sm:gap-y-2 text-sm">
                     <p>
                        <span className="text-medium-gray font-medium">Tutor:</span>{" "}
                        {homework.tutor?.name || "Not Assigned"}
                     </p>
                     <p>
                        <span className="text-medium-gray font-medium">Due Date:</span>{" "}
                        {formatDueDate(homework.dueDate)}
                     </p>
                     {homework.fileUrl && (
                        <p className="sm:col-span-2">
                           <span className="text-medium-gray font-medium">File Type:</span>{" "}
                           {getFileTypeDescription(homework.fileUrl)}
                        </p>
                     )}
                  </div>
               </div>

               {/* Download button section */}
               {homework.fileUrl && (
                  <div className="relative group min-w-max self-center lg:self-start">
                     <span className="text-xs bg-gray-800 cursor-pointer text-white px-2 py-1 rounded-md whitespace-nowrap absolute -left-12 top-0 translate-y-full opacity-0 group-hover:translate-y-[-14px] group-hover:opacity-100 transition-all duration-200 z-10">
                        Download Assignment
                     </span>
                     <EnhancedDownloader
                        fileUrl={homework.fileUrl}
                        title={homework.title || "homework"}
                        icon={true}
                        showProgress={true}
                        className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 cursor-pointer rounded-full bg-medium-gray text-white hover:bg-charcoal-gray transition-colors duration-200"
                     />
                  </div>
               )}
            </div>

            {/* Description section */}
            {homework.description && (
               <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border-l-4 border-medium-gray">
                  <h4 className="text-medium-gray font-medium mb-2 text-sm sm:text-base">
                     Description
                  </h4>
                  <p className="whitespace-pre-line text-sm sm:text-base">
                     {homework.description}
                  </p>
               </div>
            )}

            {/* Submission section */}
            <div className="pt-4 sm:pt-6 space-y-3 sm:space-y-4 border-t border-gray-200">
               <h4 className="font-medium text-base sm:text-lg">Your Submission</h4>

               {submission ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                     <p className="text-green-700 mb-3 sm:mb-4 text-sm sm:text-base">
                        You've successfully submitted your homework!
                     </p>
                     <EnhancedDownloader
                        fileUrl={submission.fileUrl}
                        title={`${homework.title || "homework"}_submission`}
                        isLate={submission?.isLate}
                        buttonText="Download Your Submission"
                        showFileInfo={true}
                        className="block w-full py-2 sm:py-3 text-center text-xs sm:text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                     />
                  </div>
               ) : (
                  <div className="space-y-3 sm:space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
                     <p className="text-xs sm:text-sm text-gray-600">
                        Upload your completed homework here. Accepted file types: PDF, DOC,
                        DOCX, JPG, PNG.
                     </p>

                     {/* Using EnhancedFileUploader component */}
                     <EnhancedFileUploader
                        onFileSelect={handleFileSelect}
                        onUpload={handleUpload}
                        title="Submit Homework"
                        acceptedFileTypes={[".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"]}
                        maxSizeMB={10}
                     />
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}

export default ViewHomework;
