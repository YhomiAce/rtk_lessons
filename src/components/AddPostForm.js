import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddNewPostMutation } from '../features/posts/postsSlice';
import { useGetUsersQuery } from '../features/users/usersSlice';

const AddPostForm = () => {
    const [addNewPost, { isLoading }] = useAddNewPostMutation()
    const navigate = useNavigate();
    const [post, setPost] = useState({
        title: '',
        content: '',
        userId: ""
    });

    const { title, content, userId } = post;
    const { data: users, } = useGetUsersQuery()
    const { ids, entities } = users;
    const usersOptions = ids.map(id => (
        <option
            key={id}
            value={id}
        >{entities[id].name}</option>
    ))

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value })
    }
    const canSave = [title, content, userId].every(Boolean) && !isLoading;

    const onSavePostClicked = async () => {
        // if (title && content) {
        //     dispatch(
        //         addPost(title, content, Number(userId))
        //     );
        //     setPost({
        //         title: '',
        //         content: '',
        //         userId: ""
        //     })
        // }
        if (canSave) {
            try {
                // dispatch(addNewPost({ title, body: content, userId })).unwrap()
                await addNewPost({ title, body: content, userId }).unwrap()
                setPost({
                    title: '',
                    content: '',
                    userId: ""
                });
                navigate('/')
            } catch (error) {
                console.error('Failed to save', error);
            }
        }
    }

    return (
        <section>
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={changeHandler}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" name='userId' value={userId} onChange={changeHandler}>
                    <option value=""></option>
                    {usersOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="content"
                    name="content"
                    value={content}
                    onChange={changeHandler}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >Save Post</button>
            </form>
        </section>
    )
}

export default AddPostForm