import { useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { selectPostById } from "../features/posts/postsSlice";
import PostItem from "./PostItem";

const SinglePostPage = () => {
    const { postId } = useParams();
    const post = useSelector((state) => selectPostById(state, Number(postId)));
    console.log(post);
    if (!post || post === undefined) {
        <section>
            <h2>Post not found!</h2>
        </section>
    }
  return <PostItem isFull post={post} />
}

export default SinglePostPage