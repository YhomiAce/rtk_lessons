import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import { apiSlice } from "../api/apiSlice";

// const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';


// const initialState = [
//     {
//         id: 1,
//         title: "Learning Redux toolkit",
//         date: sub(new Date(), { minutes: 10}).toISOString(),
//         reactions: {
//             thumbsUp: 0,
//             wow: 0,
//             heart: 0,
//             rocket: 0,
//             coffee: 0
//         },
//         content: "RTK Query is built on top of the Redux Toolkit core for its implementation, using Redux internally for its architecture"
//     },
//     {
//         id: 2,
//         title: "Learning React hook form",
//         date: sub(new Date(), { minutes: 40}).toISOString(),
//         reactions: {
//             thumbsUp: 0,
//             wow: 0,
//             heart: 0,
//             rocket: 0,
//             coffee: 0
//         },
//         content: "RTK Query is built on top of the Redux Toolkit core for its implementation, using Redux internally for its architecture"
//     },
// ]

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPosts: builder.query({
            query: () => '/posts',
            transformResponse: res => {
                let min = 1;
                const loadedPosts = res.map(post => {
                    if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    if (!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    };
                    return post;
                });
                return postsAdapter.setAll(initialState, loadedPosts)
            },
            providesTags: (result, error, arg) => [
                {
                    type: 'Post', id: 'LIST'
                },
                ...result.ids.map(id => ({ type: 'Post', id }))
            ]
        }),
        getPostsByUserId: builder.query({
            query: id => `/posts/?userId=${id}`,
            transformResponse: res => {
                let min = 1;
                const loadedPosts = res.map(post => {
                    if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    if (!post?.reactions) post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    };
                    return post;
                });
                return postsAdapter.setAll(initialState, loadedPosts)
            },
            providesTags: (result, error, arg) => [
                {
                    type: 'Post', id: 'LIST'
                },
                ...result.ids.map(id => ({ type: 'Post', id }))
            ]
        }),
        addNewPost: builder.mutation({
            query: payload => ({
                url: '/posts',
                method: 'POST',
                body: {
                    ...payload,
                    userId: Number(payload.userId),
                    date: new Date().toISOString(),
                    reactions: {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                }
            }),
            invalidatesTags: [
                {
                    type: 'Post', id: 'LIST'
                }
            ]
        }),
        updatePost: builder.mutation({
            query: payload => ({
                url: `/posts/${payload.id}`,
                method: 'PATCH',
                body: {
                    ...payload,
                    date: new Date().toISOString()
                }
            }),
            invalidatesTags: (result, error, arg) => [
                {
                    type: 'Post', id: arg.id
                }
            ]
        }),
        deletePost: builder.mutation({
            query: ({id}) => ({
                url: `/posts/${id}`,
                method: 'DELETE',
                body: {id}
            }),
            invalidatesTags: (result, error, arg) => [
                {
                    type: 'Post', id: arg.id
                }
            ]
        }),
        addReaction: builder.mutation({
            query: ({postId, reactions}) => ({
                url: `/posts/${postId}`,
                method: 'PATCH',
                body: { reactions }
            }),
            async onQueryStarted({postId, reactions}, {dispatch, queryFulfilled}){
                const patchResult = dispatch(
                    extendedApiSlice.util.updateQueryData('getPosts', undefined, draft => {
                        const post = draft.entities[postId]
                        if(post) post.reactions = reactions
                    })
                )
                try {
                    await queryFulfilled
                } catch (error) {
                    patchResult.undo()
                }
            }
        })
    })
})

export const {
    useGetPostsQuery,
    useGetPostsByUserIdQuery,
    useAddNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useAddReactionMutation
} = extendedApiSlice;

// returns the query result object
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

// creates memoized selector
const selectPostData = createSelector(
    selectPostsResult,
    postsResult => postsResult.data
)

// export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
//     try {
//         const response = await axios.get(BASE_URL);
//         return [...response.data]
//     } catch (error) {
//         return error.message
//     }
// });

// export const addNewPost = createAsyncThunk("posts/addNewPost", async (payload) => {
//     try {
//         const res = await axios.post(BASE_URL, payload);
//         return res.data
//     } catch (error) {
//         return error.message;
//     }
// })

// export const updatePost = createAsyncThunk("posts/updatePost", async (payload) => {
//     try {
//         const { id } = payload
//         const res = await axios.put(`${BASE_URL}/${id}`, payload);
//         return res.data
//     } catch (error) {
//         // return error.message;
//         return payload;
//     }
// })

// export const deletePost = createAsyncThunk("posts/deletePost", async (payload) => {
//     try {
//         const { id } = payload
//         const res = await axios.delete(`${BASE_URL}/${id}`, payload);
//         if(res.status === 200)  return payload;
//         return `${res.status}: ${res.statusText}`;
//     } catch (error) {
//         return error.message;
//     }
// })

// const postsSlice = createSlice({
//     name: 'posts',
//     initialState,
//     reducers: {
//         addPost: {
//             reducer(state, action) {
//                 state.posts.push(action.payload);
//             },
//             prepare(title, content, userId) {
//                 return {
//                     payload: {
//                         id: nanoid(),
//                         title,
//                         content,
//                         userId,
//                         date: new Date().toISOString(),
//                         reactions: {
//                             thumbsUp: 0,
//                             wow: 0,
//                             heart: 0,
//                             rocket: 0,
//                             coffee: 0
//                         },
//                     }
//                 }
//             }
//         },
//         addReaction(state, action) {
//             const { postId, reaction } = action.payload;
//             const existingPost = state.entities[postId]
//             if (existingPost) {
//                 existingPost.reactions[reaction]++
//             }
//         },
//         increaseCount(state, action) {
//             state.count +=1;
//         }
//     },
//     extraReducers(builder) {
//         builder
//             .addCase(fetchPosts.pending, (state, action) => {
//                 state.status = 'loading'
//             })
//             .addCase(fetchPosts.fulfilled, (state, action) => {
//                 state.status = "succeeded";
//                 let min = 1;
//                 const loadedPosts = action.payload.map(post => {
//                     post.date = sub(new Date(), { minutes: min++ }).toISOString();
//                     post.reactions = {
//                         thumbsUp: 0,
//                         wow: 0,
//                         heart: 0,
//                         rocket: 0,
//                         coffee: 0
//                     };
//                     return post;
//                 });
//                 // state.posts = state.posts.concat(loadedPosts);
//                 postsAdapter.upsertMany(state, loadedPosts)
//             })
//             .addCase(fetchPosts.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = action.error.message
//             })
//             .addCase(addNewPost.fulfilled, (state, action) => {
//                 action.payload.userId = Number(action.payload.userId);
//                 action.payload.date = new Date().toISOString();
//                 action.payload.reactions = {
//                     thumbsUp: 0,
//                     wow: 0,
//                     heart: 0,
//                     rocket: 0,
//                     coffee: 0
//                 };
//                 console.log(action.payload);
//                 // state.posts.push(action.payload)
//                 postsAdapter.addOne(state, action.payload)
//             })
//             .addCase(updatePost.fulfilled, (state, action) => {
//                 if (!action.payload.id) {
//                     console.log(action.payload);
//                     return;
//                 }
//                 // const { id } = action.payload;
//                 action.payload.date = new Date().toISOString();
//                 // const posts = state.posts.filter(where => where.id !== id);
//                 // state.posts = [...posts, action.payload]
//                 postsAdapter.upsertOne(state, action.payload)
//             })
//             .addCase(deletePost.fulfilled, (state, action) => {
//                 if (!action.payload.id) {
//                     console.log(action.payload);
//                     return;
//                 }
//                 const { id } = action.payload;
//                 // const posts = state.posts.filter(where => where.id !== id);
//                 // state.posts = posts;
//                 postsAdapter.removeOne(state, id)
//             })
//     }
// })

// createEntityAdapter selector

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
} = postsAdapter.getSelectors(state => selectPostData(state) ?? initialState);

// export const selectAllPosts = state => state.posts.posts;
// export const getPostStatus = state => state.posts.status;
// export const getPostError = state => state.posts.error;
// export const getCount = state => state.posts.count;
// export const selectPostById = (state, postId) => (
//     state.posts.posts.find(where => where.id === postId)
// );
// export const selectPostsByuser = createSelector(
//     [selectAllPosts, (state, userId) => userId],
//     (posts, userId) => posts.filter(post => post.userId === userId)
// )

// export const { addPost, addReaction, increaseCount } = postsSlice.actions

// export default postsSlice.reducer