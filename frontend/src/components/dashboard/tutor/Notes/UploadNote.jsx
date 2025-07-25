import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { subjectsOfAUser } from "../../../../services/operations/subject.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EnhancedFileUploader from "../../Students/homework/EnhancedFileUploader";
import { uploadNotes } from "../../../../services/operations/notes.service";
import { getAllStandards } from "../../../../services/operations/standard.service";

function UploadNote() {
   const { token } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [subjects, setSubjects] = useState([]);
   const [standardsList, setStandardsList] = useState([]);
   const [selectedSub, setSelectedSub] = useState("");
   const [selectedStandard, setSelectedStandard] = useState("");
   const [title, setTitle] = useState("");

   useEffect(() => {
      const fetchSubjects = async () => {
         try {
            const response = await dispatch(subjectsOfAUser(token));
            if (response) {
               setSubjects(response);
            }
         } catch (error) {
            console.error("Error in fetching subjects:", error);
            toast.error("Error in fetching subjects");
         }
      };
      fetchSubjects();
   }, [dispatch, token]);

   useEffect(() => {
      const fetchStandards = async () => {
         try {
            const response = await dispatch(getAllStandards(token));
            if (response) {
               setStandardsList(response);
            }
         } catch (error) {
            console.error("Error in fetching standards:", error);
            toast.error("Error in fetching standards");
         }
      };
      fetchStandards();
   }, [dispatch, token]);

   const handleUpload = async (file, trackProgress) => {
      if (!file) {
         toast.error("Please select a file to upload.");
         return;
      }
      if (!title) {
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

      try {
         const formData = new FormData();
         formData.append("title", title);
         formData.append("subject", selectedSub);
         formData.append("standardId", selectedStandard);
         formData.append("file", file);

         const response = await dispatch(
            uploadNotes(formData, token, trackProgress)
         );

         if (response) {
            toast.success("Notes uploaded successfully!");
            navigate(-1);
         } else {
            throw new Error("Failed to upload notes");
         }
      } catch (error) {
         console.error("Error during notes upload:", error);
         toast.error(error.message || "An error occurred during upload.");
         throw error;
      }
   };

   return (
      <div className="p-4 sm:p-6">
         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">Upload Notes</h1>
            <button
               onClick={() => navigate(-1)}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200 self-start sm:self-auto"
            >
               <IoMdArrowRoundBack />
               Back
            </button>
         </div>

         <div className="w-full sm:w-4/5 lg:w-2/3 mx-auto text-medium-gray p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl shadow-medium-gray bg-white">
            <div className="space-y-4 sm:space-y-6">
               {/* Title Input */}
               <div>
                  <label className="block text-base sm:text-lg font-medium text-charcoal-gray mb-2">
                     Title
                  </label>
                  <input
                     type="text"
                     placeholder="Enter Title"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     className="border-2 border-gray-300 outline-none w-full px-3 py-2 rounded-lg focus:border-charcoal-gray transition-colors duration-200 text-sm sm:text-base"
                  />
               </div>

               {/* Subject Select */}
               <div>
                  <label className="block text-base sm:text-lg font-medium text-charcoal-gray mb-2">
                     Subject
                  </label>
                  <select
                     className="border-2 text-gray-500 outline-none border-gray-300 w-full px-3 py-2 rounded-lg focus:border-charcoal-gray transition-colors duration-200 text-sm sm:text-base"
                     value={selectedSub}
                     onChange={(e) => setSelectedSub(e.target.value)}
                  >
                     <option value="" disabled>
                        Select Subject
                     </option>
                     {subjects &&
                        subjects.map((item) => (
                           <option key={item._id} value={item._id}>
                              {item.name}
                           </option>
                        ))}
                  </select>
               </div>

               {/* Standard Select */}
               <div>
                  <label className="block text-base sm:text-lg font-medium text-charcoal-gray mb-2">
                     Standard
                  </label>
                  <select
                     className="border-2 text-gray-500 outline-none border-gray-300 w-full px-3 py-2 rounded-lg focus:border-charcoal-gray transition-colors duration-200 text-sm sm:text-base"
                     value={selectedStandard}
                     onChange={(e) => setSelectedStandard(e.target.value)}
                  >
                     <option value="" disabled>
                        Select Standard
                     </option>
                     {standardsList &&
                        standardsList.map((std) => (
                           <option key={std._id} value={std._id}>
                              {std.standardName}
                           </option>
                        ))}
                  </select>
               </div>

               {/* File Upload Section */}
               <div>
                  <label className="block text-base sm:text-lg font-medium text-charcoal-gray mb-2">
                     Upload File
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
                     <p className="text-xs sm:text-sm text-gray-600 mb-4">
                        Upload your notes here. Accepted file types: PDF, DOC, DOCX, JPG, PNG.
                     </p>

                     <EnhancedFileUploader
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
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default UploadNote;
