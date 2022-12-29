// import { useDispatch } from "react-redux";
// import { addReaction } from "../features/posts/postsSlice";
import { useAddReactionMutation } from "../features/posts/postsSlice";

const reactionEmoji = {
    thumbsUp: '👍',
    wow: '😮',
    heart: '❤️',
    rocket: '🚀',
    coffee: '☕'
};

const ReactionButtons = ({ post }) => {
    // const dispatch = useDispatch()
    const [addReaction] = useAddReactionMutation()

    const onAddReaction = (name) => {
        const newValue = post.reactions[name] + 1
        addReaction({ postId: post.id, reactions: {...post.reactions, [name]: newValue} })
    }

    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
        return (
            <button
                key={name}
                type="button"
                className="reactionButton"
                onClick={() =>onAddReaction(name)}
            >
                {emoji} {post.reactions[name]}
            </button>
        )
    })

    return <div>{reactionButtons}</div>
}

export default ReactionButtons