import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addNewPost } from '../features/posts/postsSlice';
import { selectAllUsers } from '../features/users/usersSlice';

const AddPostForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const users = useSelector(selectAllUsers);
    const [post, setPost] = useState({
        title: '',
        content: '',
        userId: ""
    });
    const [status, setStatus] = useState('idle');

    const { title, content, userId } = post;

    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value })
    }
    const canSave = [title, content, userId].every(Boolean) && status === 'idle';

    const onSavePostClicked = () => {
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
                setStatus('pending');
                dispatch(addNewPost({ title, body: content, userId })).unwrap()
                setPost({
                    title: '',
                    content: '',
                    userId: ""
                });
                navigate('/')
            } catch (error) {
                console.error('Failed to save', error);
            } finally {
                setStatus('idle')
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