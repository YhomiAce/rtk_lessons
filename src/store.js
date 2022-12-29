import { configureStore, } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice";
// import postsReducer from './features/posts/postsSlice';
// import usersReducer from './features/users/usersSlice';

export const store = configureStore({
    reducer: {
        // posts: postsReducer,
        // users: usersReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware => 
        getDefaultMiddleware().concat(apiSlice.middleware)
});