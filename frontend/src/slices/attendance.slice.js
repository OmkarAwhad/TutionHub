import { createSlice } from "@reduxjs/toolkit"

const initialState = {
   markAttendanceLecture: JSON.parse(localStorage.getItem("markAttendanceLecture")) || null,
}

const attendanceSlice = createSlice({
   name:"attendance",
   initialState:initialState,
   reducers:{
      setMarkAttendanceLecture(state,value){
         state.markAttendanceLecture = value.payload
         localStorage.setItem("markAttendanceLecture", JSON.stringify(value.payload))
      },
      clearMarkAttendanceLecture(state) {
         state.markAttendanceLecture = null
         localStorage.removeItem("markAttendanceLecture")
      }
   }
})

export const {setMarkAttendanceLecture, clearMarkAttendanceLecture} = attendanceSlice.actions;
export default attendanceSlice.reducer;