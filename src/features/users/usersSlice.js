import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = 'https://jsonplaceholder.typicode.com/users';

const initialState = [
    
]

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    try {
        const res = await axios.get(BASE_URL);
        return [...res.data]
    } catch (error) {
        return error.message
    }
})

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            return action.payload;
        })
    }
});

export const selectAllUsers = state => state.users;
export const selectUserById = (state, userId) => (
    state.users.find(where => where.id === userId)
);

export default usersSlice.reducer