import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : "User",
    initialState : null,
    reducers : {
        addUserData : (state, action) => {
            return action.payload
        },
        clearData : (state,action) => {
            return null
        },
        addPost : (state, action) => {
            state.posts.push(action.payload)
        }

    }
})



export default userSlice.reducer
export const {addUserData, clearData, addPost} = userSlice.actions


