const Announcement = require("../models/announcement.model");
const User = require("../models/user.model");
const Subject = require("../models/subject.model");
const Standard = require("../models/standard.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");

module.exports.createAnnouncement = async (req, res) => {
   try {
      const { message, target, subject, standard } = req.body;

      if (!message || !target) {
         return res.json(new ApiError(400, "Message and target are required"));
      }

      let targetUsers;
      if (target === "Students") targetUsers = "Student";
      else if (target === "Tutors") targetUsers = "Tutor";
      else if (target === "All") targetUsers = "All";

      let subjectDetails;
      if (subject) {
         subjectDetails = await Subject.findById(subject);
         if (!subjectDetails) {
            return res.json(new ApiError(400, "Subject not found"));
         }
      }

      let standardDetails;
      if (standard) {
         standardDetails = await Standard.findById(standard);
         if (!standardDetails) {
            return res.json(new ApiError(400, "Standard not found"));
         }
      }

      // Build basic query
      let query = {};
      if (targetUsers === "All") {
         query.role = { $in: ["Student", "Tutor"] };
      } else {
         query.role = targetUsers;
      }

      // Add subject filter if provided
      if (subject) {
         query.subjects = { $in: [subject] };
      }

      // First, find users based on role and subject
      let targetedUsers = await User.find(query).populate("profile");

      // If standard is specified and we're targeting Students or All, filter by standard
      if (standard && (target === "Students" || target === "All")) {
         targetedUsers = targetedUsers.filter(user => {
            return user.profile && user.profile.standard && 
                  user.profile.standard.toString() === standard;
         });
      }

      console.log("Targeted users count:", targetedUsers.length);

      if (targetedUsers.length === 0) {
         return res.json(
            new ApiError(
               404,
               "No users found for the specified criteria"
            )
         );
      }

      // Create announcement
      const announcementDetails = await Announcement.create({
         message: message,
         target: target,
         subject: subject || null,
         standard: standard || null,
         createdBy: req.user.id,
      });

      // Add announcement to targeted users
      const targetedUserIds = targetedUsers.map(user => user._id);
      await User.updateMany(
         { _id: { $in: targetedUserIds } },
         {
            $addToSet: {
               announcement: announcementDetails._id,
            },
         }
      );

      return res.json(
         new ApiResponse(
            200,
            {
               announcement: announcementDetails,
               targetedUsers: targetedUsers.length
            },
            "Announcement created successfully"
         )
      );
   } catch (error) {
      console.log("Error creating announcement: ", error);
      return res.json(
         new ApiError(
            500,
            "Error creating announcement: " + error.message
         )
      );
   }
};

module.exports.getMyAnnouncements = async (req, res) => {
   try {
      const userId = req.user.id;
      
      const userDetails = await User.findById(userId)
         .populate({
            path: "announcement",
            populate: [
               { path: "subject", select: "name code" },
               { path: "standard", select: "standardName" },
               { path: "createdBy", select: "name role" }
            ]
         })
         .exec();

      if (!userDetails) {
         return res.json(new ApiError(404, "User not found"));
      }

      return res.json(
         new ApiResponse(
            200,
            userDetails,
            "Announcements fetched successfully"
         )
      );
   } catch (error) {
      console.log("Error fetching announcements: ", error);
      return res.json(
         new ApiError(
            500,
            "Error fetching announcements: " + error.message
         )
      );
   }
};

module.exports.getAllAnnouncements = async (req, res) => {
   try {
      const announcementDetails = await Announcement.find()
         .populate("subject", "name code")
         .populate("standard", "standardName")
         .populate("createdBy", "name role")
         .sort({ createdAt: -1 })
         .exec();

      if (!announcementDetails || announcementDetails.length === 0) {
         return res.json(new ApiError(404, "No announcements found"));
      }

      return res.json(
         new ApiResponse(
            200,
            announcementDetails,
            "Announcements fetched successfully"
         )
      );
   } catch (error) {
      console.log("Error fetching announcements: ", error);
      return res.json(
         new ApiError(
            500,
            "Error fetching announcements: " + error.message
         )
      );
   }
};

module.exports.deleteAnnouncement = async (req, res) => {
   try {
      const { announcementId } = req.body;

      const announcementDetails = await Announcement.findById(announcementId);
      if (!announcementDetails) {
         return res.json(new ApiError(400, "Announcement not found"));
      }

      // Remove announcement from all users
      await User.updateMany(
         { announcement: { $in: [announcementId] } },
         {
            $pull: {
               announcement: announcementId,
            },
         }
      );

      // Delete the announcement
      await Announcement.findByIdAndDelete(announcementId);

      return res.json(
         new ApiResponse(200, {}, "Announcement deleted successfully")
      );
   } catch (error) {
      console.log("Error deleting announcement ", error);
      return res.json(
         new ApiError(500, "Error deleting announcement " + error.message)
      );
   }
};
