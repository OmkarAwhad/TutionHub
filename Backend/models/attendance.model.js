const mongoose = require("mongoose")

const attendanceSchema = new mongoose.Schema({
   status:{
      type: String,
      enum: ["Present", "Absent"],
      required: true
   },
   lecture:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Lecture",
      required:true,
   },
   student:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
   },
   markedOn:{
      type:Date,
      default:Date.now,
   },
   date:{
      type:Date,
      required:true,
   },
})

module.exports = mongoose.model("Attendance", attendanceSchema)