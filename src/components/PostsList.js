// import { useSelector, } from "react-redux"
import { useGetPostsQuery } from "../features/posts/postsSlice";
import PostItem from "./PostItem";

const PostsList = () => {
    const {data: posts, isError, isLoading, error, isSuccess} = useGetPostsQuery()

    let content;
    if (isLoading) {
        content = <p>Loading.....</p>
    }else if (isSuccess) {
        // console.log(posts);
        const { entities, ids} = posts;
        content = ids.map(id => (
            <PostItem key={id} post={entities[id]} />
        ));
    }else if (isError) {
        content = <p> {error} </p>
    }
    
    
  return (
    <section>
        <h2>Posts</h2>
        { content }
    </section>
  )
}

export default PostsList