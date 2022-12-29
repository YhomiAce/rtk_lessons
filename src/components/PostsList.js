import { useSelector, } from "react-redux"
import { selectAllPosts, getPostError, getPostStatus } from "../features/posts/postsSlice";
import PostItem from "./PostItem";


const PostsList = () => {
    const posts = useSelector(selectAllPosts);
    const status = useSelector(getPostStatus);
    const error = useSelector(getPostError);

    let content;
    if (status === 'loading') {
        content = <p>Loading.....</p>
    }else if (status === 'succeeded') {
        console.log(posts);
        content = posts.map(post => (
            <PostItem key={post.id} post={post} />
        ));
    }else if (status === 'failed') {
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