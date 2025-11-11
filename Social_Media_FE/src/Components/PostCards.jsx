import { useState } from "react"
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react"
import PostModal from "./PostModal"
import axios from "axios"
const Feed = ({ posts }) => {
  return (
    <div className="max-w-xl mx-auto mt-6 space-y-6 ">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  )
}


const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(post.isLikedByMe)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [showComments, setShowComments] = useState(false)
  const [openReplies, setOpenReplies] = useState({})
  const [commentLikes, setCommentLikes] = useState(
    post.comments.reduce((acc, c) => ({ ...acc, [c._id]: c.likes.includes(post.author._id) }), {})
  )
  // console.log(commentLikes)
  const [replyInputs, setReplyInputs] = useState({}) // text input per comment
  const[useModal, setUseModal] = useState(false)

  // console.log(post)

  const toggleLikePost = () => {
    // setLiked(!liked)
    // setLikesCount((prev) => (liked ? prev - 1 : prev + 1))
    // TODO: API call to toggle post like

    async function like()
    {
      const likeRes = axios.patch(import.meta.env.VITE_DOMAIN +  `/api/posts/${post._id}/like`, {}, {withCredentials : true})
      console.log(likeRes)
      setLiked(prev => !prev)
      setLikesCount((prev) => (prev + 1))

    }

    async function unlike() {
      const unlikeRes = axios.patch(import.meta.env.VITE_DOMAIN + `/api/posts/${post._id}/unlike`, {}, {withCredentials : true})
      console.log(unlikeRes)
      setLiked(prev => !prev)
      setLikesCount((prev) => (prev - 1))

    }
    if(liked)
    {
      unlike()
    }
    else
    {
      like()
    }

  }

  const toggleLikeComment = (commentId) => {
    setCommentLikes((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }))
    // TODO: API call to toggle comment like
    async function likeComment()
    {
      const res = await axios.post(import.meta.env.VITE_DOMAIN + `/api/comments/${post._id}/${commentId}/like`, {}, {withCredentials : true})
      console.log(res)
    }

    async function unlikeComment()
    {
      const res = await axios.patch(import.meta.env.VITE_DOMAIN + `/api/comments/${post._id}/${commentId}/unlike`, {}, {withCredentials : true})
      console.log(res)
    }

    const isLiked = commentLikes[commentId]
    if(isLiked)
    {
      unlikeComment()
    }
    else
    {
      likeComment()
    }

    
  }



  return (
    <div className="bg-white rounded-xl shadow-md ">
      {/* Header */}
      <div className="flex items-center px-4 py-3">
        <img
          src={post.author.profilePicture}
          alt={post.author.username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3 flex-1">
          <p className="font-semibold text-sm">{post.author.username}</p>
          <p className="text-xs text-gray-500">{post.location}</p>
        </div>
      </div>

      {/* Media */}
      <div className="w-full">
        {post.media.length > 1 ? (
          <div className="flex overflow-x-scroll snap-x">
            {post.media.map((m, i) => (
              <img
                key={i}
                src={m}
                alt="post-media"
                className="w-full snap-center"
              />
            ))}
          </div>
        ) : (
          <img src={post.media[0]} alt="post-media" className="w-full object-cover" />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex space-x-4">
          <button onClick={toggleLikePost}>
            <Heart
              className={`w-6 h-6 ${liked ? "fill-red-500 text-red-500" : "text-gray-800"}`}
            />
          </button>
          <button onClick={() => 
          {setShowComments(true)
            setUseModal(true)}
          }>
            <MessageCircle className="w-6 h-6 text-gray-800" />
          </button>
          <button>
            <Send className="w-6 h-6 text-gray-800" />
          </button>
        </div>
        <button>
          <Bookmark className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* Likes + Caption */}
      <div className="px-4 pb-3 space-y-1">
        <p className="font-semibold text-sm">{likesCount} likes</p>
        <p className="text-sm">
          <span className="font-semibold">{post.author.username}</span>{" "}
          {post.caption}
        </p>

        {/* View all comments */}
        {!showComments && post.commentsCount > 0 && (
          <p
            className="text-xs text-gray-500 cursor-pointer"
            onClick={() => setShowComments(true)}
          >
            View all {post.commentsCount} comments
          </p>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-3 mt-2">
            {post.comments.map((c) => (
              <div key={c._id} className="space-y-1">
                {/* Single Comment */}
                <div className="flex items-start space-x-2">
                  <img
                    src={c.author.profilePicture}
                    alt={c.author.username}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm flex items-center justify-between">
                      <span>
                        <span className="font-semibold">{c.author.username}</span>{" "}
                        {c.text}
                      </span>
                      {/* Like button for comment */}
                      <Heart
                        className={`w-4 h-4 cursor-pointer ml-2 ${
                          commentLikes[c._id] ? "fill-red-500 text-red-500" : "text-gray-400"
                        }`}
                        onClick={() => toggleLikeComment(c._id)}
                      />
                    </p>

                    {/* Reply toggle */}
                    {/* <p className="text-xs text-gray-500 mt-1 cursor-pointer">
                      <span onClick={() =>
                        setOpenReplies((prev) => ({ ...prev, [c._id]: !prev[c._id] }))
                      }>
                        {c.reply?.length > 0 &&
                          (openReplies[c._id] ? "Hide replies" : `View replies (${c.reply.length})`)}
                      </span>
                    </p> */}

                    {/* Reply input */}
                    {/* <div className="mt-1">
                      <input
                        type="text"
                        placeholder="Reply..."
                        className="w-full border border-gray-200 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        value={replyInputs[c._id] || ""}
                        onChange={(e) => handleReplyChange(c._id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submitReply(c._id)
                        }}
                      />
                    </div> */}

                    {/* Replies */}
                    {/* {openReplies[c._id] &&
                      c.reply?.map((r) => (
                        <div key={r._id} className="flex items-start space-x-2 ml-8 mt-1">
                          <img
                            src={r.author.profilePicture}
                            alt={r.author.username}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <p className="text-sm">
                            <span className="font-semibold">{r.author.username}</span>{" "}
                            {r.text}
                          </p>
                        </div>
                      ))} */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400 uppercase mt-1">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      {useModal && <PostModal post={post} setUseModal={setUseModal} />}
    </div>
  )
}





export default Feed
