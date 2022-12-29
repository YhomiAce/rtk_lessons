import React from 'react';
import { Link } from 'react-router-dom';
import PostAuthor from "./PostAuthor";
import ReactionButtons from "./ReactionButtons";
import TimeAgo from "./TimeAgo";

const PostItem = ({ post, isFull }) => {
    return (
        <article>
            <h3> {post.title} </h3>
            
            {
                isFull ?  <p className='excerpt'> {post.body} </p> :
                <p className='excerpt'> {post.body.substring(0, 100)} </p>
            }
            <p className="postCredit">
                {
                    !isFull ?
                    <Link to={`post/${post.id}`}> View Post</Link> :
                    <Link to={`/post/edit/${post.id}`}> Edit Post</Link> 
                }
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
           
            <ReactionButtons post={post} />
        </article>
    )
}

export default PostItem