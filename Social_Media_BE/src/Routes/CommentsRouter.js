const express = require("express")
const router = express.Router()
const{isLoggedIn} = require("../Middlewares/IsLoggedIn")
const{ Post } = require("../Models/Posts")
const{ Comment } = require("../Models/Comment")
const { Reply } = require("../Models/Reply")

router.post("/comments/:postId", isLoggedIn, async(req, res) => {
    try {
        const{postId} = req.params
        const{text} = req.body
        const foundPost = await Post.findById(postId).populate("author")
        if(!foundPost)
        {
            throw new Error("Post Not Found")
        }
        if(foundPost.author.isPrivate)
        {
            if(foundPost.author._id.toString() == req.user._id.toString() || foundPost.author.followers.some((item) => {
                return item.toString() == req.user._id.toString()
            }))
            {
                // console.log(foundPost)
                const newComment = await Comment.create({author : req.user._id, text })
                foundPost.comments.push(newComment._id)
                foundPost.save()
                res.status(201).json({msg : "done", data : newComment})

            }
            else
            {
                throw new Error("Invalid Operation")
            }
        }
        else
        {
            const newComment = await Comment.create({author : req.user._id, text })
            foundPost.comments.push(newComment._id)
            foundPost.save()
            res.status(201).json({msg : "done", data : newComment})

        }

        // res.status(201).json({msg : "done", data : foundPost})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})

router.post("/comments/:postId/:commentId/like", isLoggedIn, async(req, res) => {
    try {
       const{postId, commentId} = req.params
       const foundPost = await Post.findById(postId)
       const foundComment = await Comment.findById(commentId)
    
       if(!foundPost || !foundComment)
       {
        throw new Error("Invalid Operation")
       }

       if(foundComment.likes.some(item => item.toString() == req.user._id.toString()))
       {
        throw new Error("Cannot like a comment more than once")
       }

       if(foundPost.comments.some((item) => {return item.toString() === commentId.toString()}))
       {
            if(foundPost.author.isPrivate)
            {
                if(foundPost.followers.some(item => item.toString() == req.user._id))
                {
                    foundComment.likes.push(req.user._id)
                    await foundComment.save()
                }
                else
                {
                    throw new Error("Invalid Operation / Not following the user")
                }
            }
            else
            {
                foundComment.likes.push(req.user._id)
                await foundComment.save()
            }
       }
       else
       {
        throw new Error("Invalid Operation")
       }
       res.status(201).json({msg : "done"})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})

router.post("/comments/:postId/:commentId/reply", isLoggedIn, async(req, res) => {
    try {
        const{postId, commentId} = req.params
        const{text} = req.body 
        const foundPost = await Post.findById(postId).populate("author")
        const foundComment = await Comment.findById(commentId)

        if(!foundComment || !foundPost)
        {
            throw new Error("Post / Comment not found")
        }

        if(foundPost.comments.some(item => item.toString() == commentId))
        {
            if(foundPost.author.isPrivate)
            {
                if(foundPost.author.followers.some(item => item.toString() == req.user._id.toString()) || foundPost.author._id.toString() == req.user._id.toString())
                {
                    const newReply = await Reply.create({text, author : req.user._id})
                    foundComment.reply.push(newReply._id)
                    foundComment.save()
        res.status(201).json({msg : "done", data : newReply})

                }
                else
                {
                    throw new Error("Invalid Operation / Not following the user")
                }
            }
            else
            {
                const newReply = await Reply.create({text, author : req.user._id})
                foundComment.reply.push(newReply._id)
                foundComment.save()
        res.status(201).json({msg : "done", data : newReply})

            }
        }
        else
        {
            throw new Error("Invalid Operation")
        }

        // res.status(201).json({msg : "done", data : foundPost})

    } catch (error) {
        res.status(400).json({error : error.message})
    }
})

router.delete("/comments/:postId/:commentId", isLoggedIn, async(req, res) => {
    try {
        const{postId, commentId} = req.params
        const foundPost = await Post.findById(postId).populate("author")
        const foundComment = await Comment.findById(commentId)

        if(!foundPost || !foundComment)
        {
            throw new Error("Post / Comment not found")
        }

        if(foundPost.comments.some(item => item.toString() == commentId))
        {
            if(foundPost.author.isPrivate)
            {
                if((foundPost.author.followers.some(item => item.toString() == req.user._id.toString()) 
                    && foundComment.author.toString() == req.user._id.toString()) || foundPost.author._id.toString() == req.user._id.toString())
                {
                    await Comment.findByIdAndDelete(commentId)
                    const filteredComments = foundPost.comments.filter((item) => {
                        return item.toString() != commentId
                    })
                    foundPost.comments = filteredComments
                    foundPost.save()
                }
                else
                {
                    throw new Error("Access Denied")
                }
            }
            else
            {
                if(foundComment.author.toString() == req.user._id.toString() || foundPost.author._id.toString() == req.user._id.toString())
                {
                    await Comment.findByIdAndDelete(commentId)
                     const filteredComments = foundPost.comments.filter((item) => {
                        return item.toString() != commentId
                    })
                    foundPost.comments = filteredComments
                    foundPost.save()
                }
                else
                {
                    throw new Error("Access Denied 2")
                }
            }
        }
        else
        {
            throw new Error("Invalid Operation")
        }
        res.status(200).json({msg : "done"})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})

router.patch("/comments/:postId/:commentId/unlike", isLoggedIn, async(req, res) => {
  try {
    const { postId, commentId } = req.params
    const foundPost = await Post.findById(postId).populate("author")
    const foundComment = await Comment.findById(commentId)

    if (!foundPost || !foundComment) {
      throw new Error("Post / Comment not found")
    }

    // Check if comment belongs to the post
    if (!foundPost.comments.some((item) => item.toString() === commentId)) {
      throw new Error("Invalid Operation")
    }

    const isPostPrivate = foundPost.author.isPrivate
    const isFollower = foundPost.author.followers.some(
      (item) => item.toString() === req.user._id.toString()
    )
    const isCommentAuthor = foundComment.author.toString() === req.user._id.toString()

    // Access control
    // if (isPostPrivate && !isFollower && !isCommentAuthor) {
    //   throw new Error("Invalid Operation / Access Denied")
    // }

    // Remove user from likes
    foundComment.likes = foundComment.likes.filter(
      (item) => item.toString() !== req.user._id.toString()
    )
    await foundComment.save()

    res.status(200).json({ msg: "done" })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})


// like reply, delete reply, unlike reply




module.exports = {
    CommentRouter : router
}