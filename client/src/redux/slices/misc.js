import { createSlice } from "@reduxjs/toolkit";

const initialState={
    isNewGroup:false,
    isAddMember:false,
    isNotifications:false,
    isSearch:false,
    isFileMenu:false,
    isMobile:false,
    isEdit:false,

}
const miscSlice=createSlice({
    name:"misc",
    initialState,
    reducers:{
        setIsNewGroup:(state,action)=>{
            state.isNewGroup=action.payload
        },
        setIsAddMember:(state,action)=>{
            state.isAddMember=action.payload
        },
        setIsNotifications:(state,action)=>{
            state.isNotifications=action.payload
        },
        setIsSearch:(state,action)=>{
            state.isSearch=action.payload
        },
        setIsMobile:(state,action)=>{
            state.isMobile=action.payload
        },
        setIsFileMenu:(state,action)=>{
            state.isFileMenu=action.payload
        },
        setIsEdit:(state,action)=>{
            state.isEdit=action.payload
        }
        
    }
})
export const {
    setIsNewGroup,
    setIsFileMenu,
    setIsMobile,
    setIsSearch,
    setIsNotifications,
    setIsAddMember,
    setIsEdit,
}=miscSlice.actions;
export default miscSlice.reducer