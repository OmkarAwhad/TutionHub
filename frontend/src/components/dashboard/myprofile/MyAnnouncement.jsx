import React, { useEffect, useState } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { getMyDetails } from '../../../services/operations/users.service';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function MyAnnouncement() {
   const { token } = useSelector((state) => state.auth);

   const [announcementList, setAnnouncementList] = useState(null);

   const dispatch = useDispatch();
   const navigate = useNavigate();

   useEffect(() => {
      const fetchMyNotifications = async () => {
         try {
            const response = await dispatch(getMyDetails(token));
            if (response) {
               setAnnouncementList(response.announcement);
            }
         } catch (error) {
            toast.error("Error in fetching notifications");
            console.log(error);
         }
      };
      fetchMyNotifications();
   }, [dispatch, token]);

   return (
      <div>
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-richblack-5">
               Announcements
            </h3>
            <button
               onClick={() => navigate(-1)}
               className="flex items-center gap-2 cursor-pointer text-richblack-200 hover:text-richblack-5 transition-all duration-200"
            >
               <FaArrowLeftLong className="text-lg" />
               Back
            </button>
         </div>
         <div className="flex flex-col mt-10 gap-y-5">
            {announcementList &&
               announcementList.map((item) => (
                  <div
                     key={item._id}
                     className="bg-white shadow shadow-[#979797] p-6 text-slate-gray flex items-center justify-between rounded-lg w-full max-w-6xl mx-auto animate-slide-in"
                  >
                     <div>
                        <div>
                           Message :{" "}
                           <span className="text-charcoal-gray">
                              {item.message}
                           </span>
                        </div>
                        <div className="">
                           <p>
                              {item.target === "All" ? (
                                 <>Attention <span className="text-charcoal-gray">everyone</span>.</>
                              ) : (
                                 <>
                                    For all{" "}
                                    <span className="text-charcoal-gray">
                                       {item.target.toLowerCase()}
                                    </span>
                                    .
                                 </>
                              )}
                           </p>
                           <p>
                              Subject :{" "}
                              <span className="text-charcoal-gray">
                                 {item.subject
                                    ? item.subject
                                       .name
                                    : "All"}
                              </span>
                           </p>
                           <p>
                              Date :{" "}
                              <span className="text-charcoal-gray">
                                 {new Date(
                                    item.createdAt
                                 ).toLocaleDateString(
                                    "en-GB",
                                    {
                                       day: "2-digit",
                                       month: "2-digit",
                                       year: "2-digit",
                                    }
                                 )}
                              </span>
                           </p>
                        </div>
                     </div>
                  </div>
               ))}
         </div>
      </div>
   )
}

export default MyAnnouncement