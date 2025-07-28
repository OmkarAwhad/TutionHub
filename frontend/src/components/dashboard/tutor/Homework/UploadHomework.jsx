import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaUpload, FaPaperPlane } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { subjectsOfAUser } from "../../../../services/operations/subject.service";
import { uploadHomework } from "../../../../services/operations/homework.service";
import toast from "react-hot-toast";
import EnhancedFileUploaderNoFileRequired from "./EnhancedFileUploaderNoFileRequired";
import { getAllStandards } from "../../../../services/operations/standard.service";

function UploadHomework() {
   const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [subjects, setSubjects] = useState([]);
   const [selectedSub, setSelectedSub] = useState("");
   const [standardsList, setStandardsList] = useState([]);
   const [selectedStandard, setSelectedStandard] = useState("");
   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");
   const [dueDate, setDueDate] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const [subjectsResponse, standardsResponse] = await Promise.all([
               dispatch(subjectsOfAUser(null, token)),
               dispatch(getAllStandards(token))
            ]);
            
            if (subjectsResponse) {
               setSubjects(subjectsResponse);
            }
            
            if (standardsResponse) {
               setStandardsList(standardsResponse);
            }
         } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Error loading form data");
         }
      };
      
      fetchData();
   }, [dispatch, token]);

   // Get minimum date (today)
   const getMinDate = () => {
      const today = new Date();
      return today.toISOString().split('T')[0];
   };

   const handleUpload = async (file, trackProgress) => {
      // Validation
      if (!title.trim()) {
         toast.error("Please enter a title.");
         return;
      }
      if (!selectedSub) {
         toast.error("Please select a subject.");
         return;
      }
      if (!selectedStandard) {
         toast.error("Please select the standard.");
         return;
      }
      if (!dueDate) {
         toast.error("Please select a due date.");
         return;
      }

      // Check if due date is in the past
      const selectedDate = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
         toast.error("Due date cannot be in the past.");
         return;
      }

      try {
         setIsLoading(true);
         
         // Create form data
         const formData = new FormData();
         formData.append("title", title.trim());
         formData.append("subject", selectedSub);
         formData.append("standardId", selectedStandard);
         formData.append("description", description.trim());
         formData.append("dueDate", dueDate);
         
         // Only append file if it exists
         if (file) {
            formData.append("file", file);
         }

         const response = await dispatch(uploadHomework(formData, token));

         if (response) {
            toast.success("Homework uploaded successfully!");
            navigate(-1);
         } else {
            throw new Error("Failed to upload homework");
         }
      } catch (error) {
         console.error("Error during homework upload:", error);
         toast.error(error.message || "An error occurred during upload.");
         throw error;
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="p-4 sm:p-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
               <FaUpload className="text-charcoal-gray text-xl sm:text-2xl" />
               <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">Upload Homework</h1>
            </div>
            <button
               onClick={() => navigate(-1)}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200 self-start sm:self-auto"
            >
               <IoMdArrowRoundBack />
               Back
            </button>
         </div>

         {/* Form Container */}
         <div className="max-w-full sm:max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-light-gray">
               <div className="space-y-3 sm:space-y-4">
                  {/* Title */}
                  <div>
                     <label className="block text-base sm:text-lg font-medium text-charcoal-gray mb-2">
                        Title *
                     </label>
                     <input
                        type="text"
                        placeholder="Enter homework title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border-2 border-light-gray outline-none w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg focus:border-charcoal-gray transition-colors duration-200 text-sm sm:text-base"
                        maxLength={100}
                     />
                     <p className="text-xs text-slate-gray mt-1">
                        {title.length}/100 characters
                     </p>
                  </div>

                  {/* Description */}
                  <div>
                     <label className="block text-base sm:text-lg font-medium text-charcoal-gray mb-2">
                        Description
                     </label>
                     <textarea
                        placeholder="Enter homework description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border-2 border-light-gray outline-none w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg focus:border-charcoal-gray transition-colors duration-200 min-h-[100px] sm:min-h-[120px] resize-y text-sm sm:text-base"
                        maxLength={500}
                     />
                     <p className="text-xs text-slate-gray mt-1">
                        {description.length}/500 characters
                     </p>
                  </div>

                  {/* Subject and Due Date Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                     {/* Subject */}
                     <div>
                        <label className="block text-base sm:text-lg font-medium text-charcoal-gray mb-2">
                           Subject *
                        </label>
                        <select
                           className="border-2 border-light-gray outline-none w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg focus:border-charcoal-gray transition-colors duration-200 text-charcoal-gray text-sm sm:text-base"
                           value={selectedSub}
                           onChange={(e) => setSelectedSub(e.target.value)}
                        >
                           <option value="" disabled className="text-slate-gray">
                              Select Subject
                           </option>
                           {subjects.map((item) => (
                              <option key={item._id} value={item._id}>
                                 {item.name} ({item.code})
                              </option>
                           ))}
                        </select>
                     </div>

                     {/* Due Date */}
                     <div>
                        <label className="block text-base sm:text-lg font-medium text-charcoal-gray mb-2">
                           Due Date *
                        </label>
                        <input
                           type="date"
                           value={dueDate}
                           min={getMinDate()}
                           onChange={(e) => setDueDate(e.target.value)}
                           className="border-2 border-light-gray outline-none w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg focus:border-charcoal-gray transition-colors duration-200 text-sm sm:text-base"
                        />
                     </div>
                  </div>

                  {/* Standard */}
                  <div>
                     <label className="block text-base sm:text-lg font-medium text-charcoal-gray mb-2">
                        Standard *
                     </label>
                     <select
                        className="border-2 border-light-gray outline-none w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg focus:border-charcoal-gray transition-colors duration-200 text-charcoal-gray text-sm sm:text-base"
                        value={selectedStandard}
                        onChange={(e) => setSelectedStandard(e.target.value)}
                     >
                        <option value="" disabled className="text-slate-gray">
                           Select Standard
                        </option>
                        {standardsList.map((std) => (
                           <option key={std._id} value={std._id}>
                              {std.standardName}
                           </option>
                        ))}
                     </select>
                  </div>

                  {/* File Upload */}
                  <div>
                     <label className="block text-base sm:text-lg font-medium text-charcoal-gray mb-2">
                        Attachment
                     </label>
                     <div className="bg-light-gray/50 border border-light-gray rounded-lg p-4 sm:p-6">
                        <p className="text-xs sm:text-sm text-slate-gray mb-4">
                           Upload homework files here. Accepted file types: PDF, DOC, DOCX, JPG, PNG.
                        </p>

                        <EnhancedFileUploaderNoFileRequired
                           onUpload={handleUpload}
                           title=""
                           acceptedFileTypes={[
                              ".pdf",
                              ".doc",
                              ".docx",
                              ".jpg",
                              ".jpeg",
                              ".png",
                           ]}
                           maxSizeMB={10}
                           disabled={isLoading}
                        />
                     </div>
                  </div>

                  {/* Required Fields Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                     <p className="text-xs sm:text-sm mb-2">
                        <strong>Info:</strong> You may provide a description, attach a file, or include both when uploading homework.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default UploadHomework;
