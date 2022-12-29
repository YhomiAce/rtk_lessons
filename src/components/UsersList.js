import { Link } from 'react-router-dom'
import { useGetUsersQuery } from '../features/users/usersSlice';

const UsersList = () => {
    const { data: users, isLoading, isSuccess, isError, error } = useGetUsersQuery();

    let content;
    if (isLoading) {
        content = <p>Loading.....</p>
    }else if (isSuccess) {
        const { ids, entities } = users
        const renderedUsers = ids.map(id => (
            <li key={id}>
                <Link to={`/user/${id}`}>{entities[id].name}</Link>
            </li>
        ))
        content = renderedUsers
    }else if (isError) {
        content = <p> {error} </p>
    }

    return (
        <section>
            <h2>Users</h2>

            <ul>{content}</ul>
        </section>
    )
}

export default UsersList