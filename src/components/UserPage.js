// import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { useGetPostsByUserIdQuery } from '../features/posts/postsSlice';
import { useGetUsersQuery } from '../features/users/usersSlice';
// import { selectUserById } from '../features/users/usersSlice';

const UserPage = () => {
    const { userId } = useParams()
    // const user = useSelector(state => selectUserById(state, Number(userId)))
    const { user,
        isLoading: isLoadingUser,
        isSuccess: isSuccessUser,
        isError: isErrorUser,
        error: errorUser
    } = useGetUsersQuery('getUsers', {
        selectFromResult: ({ data, isLoading, isSuccess, isError, error }) => ({
            user: data?.entities[userId],
            isLoading,
            isSuccess,
            isError,
            error
        }),
    })

    // const postsForUser = useSelector(state => selectPostsByuser(state, Number(userId)))
    const {
        data: postsForUser, 
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsByUserIdQuery(userId);

    let content;
    if (isLoading || isLoadingUser) {
        content = <p>Loading.....</p>
    }else if (isSuccess && isSuccessUser) {
        const { ids, entities } = postsForUser
        const postTitles = ids.map(id => (
            <li key={id}>
                <Link to={`/post/${id}`}>{entities[id].title}</Link>
            </li>
        ))
        content = postTitles
    }else if (isError || isErrorUser) {
        content = <p> {error || errorUser} </p>
    }

    

    return (
        <section>
            <h2>{user?.name}</h2>

            <ol>{content}</ol>
        </section>
    )
}

export default UserPage