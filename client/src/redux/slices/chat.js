import { createSlice } from "@reduxjs/toolkit";
import { NEW_MESSAGE_ALERT } from "../../constants/events";
import { getOrSaveFromStorage } from "../../lib/Features";

const initialState = {
    notificationCount: 0,
    newMessagesAlert: getOrSaveFromStorage({
        key:[NEW_MESSAGE_ALERT],
        get:true
    })|| [{
        chatId: "",
        count: 0
    }]

}
const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {

        incrementNotificationCount(state) {
            state.notificationCount += 1;
        },
        resetNotificationCount(state) {
            state.notificationCount = 0
        },

        increaseNewMessagesAlert(state, action) {
            const chatId = action.payload
            const index = state.newMessagesAlert.findIndex(item => item.chatId === chatId)
            if (index === -1) {
                state.newMessagesAlert.push({
                    chatId,
                    count: 1
                })
            } else {
                state.newMessagesAlert[index].count += 1
            }
        },
        removeNewMessagesAlert: (state, action) => {
            const chatId = action.payload
            state.newMessagesAlert = state.newMessagesAlert.filter(message => message.chatId !== chatId)
        }
    }
})
export const {
    incrementNotificationCount,
    resetNotificationCount,
    increaseNewMessagesAlert,
    removeNewMessagesAlert
} = chatSlice.actions;
export default chatSlice.reducer