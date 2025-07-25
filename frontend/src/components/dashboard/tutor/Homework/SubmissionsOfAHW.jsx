import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { clearSelectHomework } from "../../../../slices/homework.slice";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
   getDownloadUrl,
   canPreviewFile,
   getPreviewUrl,
} from "../../../../utils/fileUtils";
import { FaDownload, FaEye } from "react-icons/fa6";
import { getSubmissions } from "../../../../services/operations/homework.service";
import toast from "react-hot-toast";
import FilePreview from "../../extras/FilePreview";
import DocumentPreview from "../../extras/FilePreview";

function SubmissionsOfAHW() {
   const { homeworkId } = useParams();
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { token } = useSelector((state) => state.auth);
   const { selectHomework } = useSelector((state) => state.homework);
   const [submitted, setSubmitted] = useState([]);
   const [notSubmitted, setNotSubmitted] = useState([]);

   // Preview states
   const [previewFile, setPreviewFile] = useState(null);
   const [showPreview, setShowPreview] = useState(false);

   useEffect(() => {
      const fetchSubmissions = async () => {
         try {
            let response = await dispatch(getSubmissions(homeworkId, token));
            if (response) {
               const filteredSubmissions = response.submissions.filter((submission) => {
                  if (!selectHomework?.standard?._id) return true;
                  return (
                     submission.student.profile?.standard?._id ===
                     selectHomework.standard._id
                  );
               });

               const filteredNotSubmitted = response.notSubmitted.filter((student) => {
                  if (!selectHomework?.standard?._id) return true;
                  return (
                     student.profile?.standard?._id ===
                     selectHomework.standard._id
                  );
               });

               setSubmitted(filteredSubmissions);
               setNotSubmitted(filteredNotSubmitted);
            }
         } catch (error) {
            toast.error("Error in fetching submissions");
            console.log("Error in fetching submissions");
         }
      };
      fetchSubmissions();
   }, [dispatch, token]);

   const closePreview = () => {
      setShowPreview(false);
      setPreviewFile(null);
   };

   const handlePreview = (fileUrl, fileName) => {
      // Extract file type from URL
      const extension = fileUrl.split(".").pop()?.toLowerCase();
      const typeMap = {
         pdf: "application/pdf",
         jpg: "image/jpeg",
         jpeg: "image/jpeg",
         png: "image/png",
         gif: "image/gif",
         webp: "image/webp",
         doc: "application/msword",
         docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };

      setPreviewFile({
         url: fileUrl,
         name: fileName,
         type: typeMap[extension] || "unknown",
      });
      setShowPreview(true);
   };

   const handleDownload = (fileUrl, fileName) => {
      const link = document.createElement("a");
      link.href = getDownloadUrl(fileUrl);
      link.download = fileName || "homework-submission";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   return (
      <div className="p-4 sm:p-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">
               {selectHomework?.title}
            </h1>
            <button
               onClick={() => navigate(-1)}
               className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200 self-start sm:self-auto"
            >
               <IoMdArrowRoundBack />
               Back
            </button>
         </div>

         {/* Homework Details */}
         <div className="bg-white rounded-lg shadow-md border border-light-gray p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
               <div>
                  <p className="text-medium-gray mb-2 text-sm sm:text-base">
                     Subject:{" "}
                     <span className="text-charcoal-gray font-semibold">
                        {selectHomework?.subject?.name} ({selectHomework?.subject?.code})
                     </span>
                  </p>
                  <p className="text-medium-gray mb-2 text-sm sm:text-base">
                     Standard:{" "}
                     <span className="text-charcoal-gray font-semibold">
                        {selectHomework?.standard?.standardName}
                     </span>
                  </p>
               </div>
               <div>
                  <p className="text-medium-gray mb-2 text-sm sm:text-base">
                     Uploaded:{" "}
                     <span className="text-charcoal-gray font-semibold">
                        {new Date(selectHomework?.createdAt).toLocaleDateString("en-GB", {
                           day: "2-digit",
                           month: "short",
                           year: "numeric",
                        })}
                     </span>
                  </p>
                  <p className="text-medium-gray mb-2 text-sm sm:text-base">
                     Due Date:{" "}
                     <span className="text-charcoal-gray font-semibold">
                        {new Date(selectHomework?.dueDate).toLocaleDateString("en-GB", {
                           day: "2-digit",
                           month: "short",
                           year: "numeric",
                        })}
                     </span>
                  </p>
               </div>
            </div>

            {selectHomework?.description && (
               <div className="mt-3 sm:mt-4">
                  <p className="text-medium-gray text-sm sm:text-base">
                     Description:{" "}
                     <span className="text-charcoal-gray">
                        {selectHomework.description}
                     </span>
                  </p>
               </div>
            )}

            {selectHomework?.fileUrl && (
               <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {canPreviewFile(selectHomework.fileUrl) && (
                     <button
                        onClick={() =>
                           handlePreview(
                              selectHomework.fileUrl,
                              `${selectHomework.title}-original`
                           )
                        }
                        className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm sm:text-base"
                     >
                        <FaEye />
                        Preview Original
                     </button>
                  )}
                  <button
                     onClick={() =>
                        handleDownload(
                           selectHomework.fileUrl,
                           `${selectHomework.title}-original`
                        )
                     }
                     className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-charcoal-gray text-white rounded-lg hover:bg-medium-gray transition-colors duration-200 text-sm sm:text-base"
                  >
                     <FaDownload />
                     Download Original
                  </button>
               </div>
            )}
         </div>

         {/* Submissions Section */}
         <div className="bg-white rounded-lg shadow-md border border-light-gray overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-light-gray">
               <h2 className="text-lg sm:text-xl font-semibold text-charcoal-gray">
                  Student Submissions ({submitted.length + notSubmitted.length} students)
               </h2>
            </div>

            {/* Mobile Cards View */}
            <div className="block sm:hidden">
               <div className="divide-y divide-light-gray">
                  {submitted.map((submission) => (
                     <div key={submission._id} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                           <div>
                              <h3 className="font-medium text-charcoal-gray">
                                 {submission.student.name}
                              </h3>
                              <div className="flex gap-2 mt-1">
                                 <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    Submitted
                                 </span>
                                 <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                       !submission.isLate
                                          ? "bg-green-100 text-green-700"
                                          : "bg-red-100 text-red-700"
                                    }`}
                                 >
                                    {!submission.isLate ? "On Time" : "Late"}
                                 </span>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              {canPreviewFile(submission.fileUrl) && (
                                 <button
                                    onClick={() =>
                                       handlePreview(
                                          submission.fileUrl,
                                          `${submission.student.name}-submission`
                                       )
                                    }
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Preview"
                                 >
                                    <FaEye />
                                 </button>
                              )}
                              <button
                                 onClick={() =>
                                    handleDownload(
                                       submission.fileUrl,
                                       `${submission.student.name}-submission`
                                    )
                                 }
                                 className="p-2 text-charcoal-gray hover:bg-gray-200 rounded transition-colors"
                                 title="Download"
                              >
                                 <FaDownload />
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}

                  {notSubmitted.map((student) => (
                     <div key={student._id} className="p-4">
                        <div className="flex justify-between items-start">
                           <div>
                              <h3 className="font-medium text-charcoal-gray">
                                 {student.name}
                              </h3>
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium mt-1 inline-block">
                                 Not Submitted
                              </span>
                           </div>
                           <div className="flex gap-2">
                              <FaEye className="text-gray-300 p-2 text-2xl" />
                              <FaDownload className="text-gray-300 p-2 text-2xl" />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
               <table className="w-full">
                  <thead className="bg-light-gray">
                     <tr>
                        <th className="py-3 px-4 text-left text-sm font-medium text-charcoal-gray">
                           Student Name
                        </th>
                        <th className="py-3 px-4 text-center text-sm font-medium text-charcoal-gray">
                           Status
                        </th>
                        <th className="py-3 px-4 text-center text-sm font-medium text-charcoal-gray">
                           Timing
                        </th>
                        <th className="py-3 px-4 text-center text-sm font-medium text-charcoal-gray">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {submitted.map((submission) => (
                        <tr
                           key={submission._id}
                           className="border-b border-light-gray hover:bg-gray-50"
                        >
                           <td className="py-3 px-4 text-charcoal-gray font-medium">
                              {submission.student.name}
                           </td>
                           <td className="py-3 px-4 text-center">
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                 Submitted
                              </span>
                           </td>
                           <td className="py-3 px-4 text-center">
                              <span
                                 className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    !submission.isLate
                                       ? "bg-green-100 text-green-700"
                                       : "bg-red-100 text-red-700"
                                 }`}
                              >
                                 {!submission.isLate ? "On Time" : "Late"}
                              </span>
                           </td>
                           <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                 {canPreviewFile(submission.fileUrl) && (
                                    <button
                                       onClick={() =>
                                          handlePreview(
                                             submission.fileUrl,
                                             `${submission.student.name}-submission`
                                          )
                                       }
                                       className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                       title="Preview submission"
                                    >
                                       <FaEye />
                                    </button>
                                 )}
                                 <button
                                    onClick={() =>
                                       handleDownload(
                                          submission.fileUrl,
                                          `${submission.student.name}-submission`
                                       )
                                    }
                                    className="p-2 text-charcoal-gray hover:bg-gray-200 rounded transition-colors"
                                    title="Download submission"
                                 >
                                    <FaDownload />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}

                     {notSubmitted.map((student) => (
                        <tr
                           key={student._id}
                           className="border-b border-light-gray hover:bg-gray-50"
                        >
                           <td className="py-3 px-4 text-charcoal-gray font-medium">
                              {student.name}
                           </td>
                           <td className="py-3 px-4 text-center">
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                 Not Submitted
                              </span>
                           </td>
                           <td className="py-3 px-4 text-center text-slate-gray">-</td>
                           <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                 <FaEye className="text-gray-300" />
                                 <FaDownload className="text-gray-300" />
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {showPreview && previewFile && (
            <DocumentPreview
               fileUrl={previewFile.url}
               fileName={previewFile.name}
               fileType={previewFile.type}
               onClose={closePreview}
            />
         )}
      </div>
   );
}

export default SubmissionsOfAHW;
