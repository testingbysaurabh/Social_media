const express = require("express")
const router = express.Router()
const{isLoggedIn} = require("../Middlewares/IsLoggedIn")
const{Post} = require("../Models/Posts")
const { User } = require("../Models/User")
const { isAuthor } = require("../Middlewares/IsAuthor")
const { default: mongoose } = require("mongoose")


 router.get("/posts/feed", isLoggedIn, async (req, res) => {
  try {
    const myUserObj = req.user
    const allowedAuthors = [myUserObj._id, ...myUserObj.following]

    const dbRes = await Post.aggregate([
      // 1️⃣ Only include posts from me + people I follow
      {
        $match: {
          author: { $in: allowedAuthors },
        },
      },

      // 2️⃣ Populate author info
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },

      // 3️⃣ Populate comments
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },

      // 4️⃣ Populate comment authors
      {
        $lookup: {
          from: "users",
          localField: "comments.author",
          foreignField: "_id",
          as: "commentAuthors",
        },
      },

      // 5️⃣ Populate replies of each comment
      {
        $lookup: {
          from: "replies",
          localField: "comments.reply",
          foreignField: "_id",
          as: "allReplies",
        },
      },

      // 6️⃣ Populate authors of replies
      {
        $lookup: {
          from: "users",
          localField: "allReplies.author",
          foreignField: "_id",
          as: "replyAuthors",
        },
      },

      // 7️⃣ Merge comment authors and replies into each comment
      {
        $addFields: {
          comments: {
            $map: {
              input: "$comments",
              as: "c",
              in: {
                _id: "$$c._id",
                text: "$$c.text",
                likes: "$$c.likes",
                reply: {
                  $map: {
                    input: "$$c.reply",
                    as: "rId",
                    in: {
                      $let: {
                        vars: {
                          rep: { $arrayElemAt: [{ $filter: { input: "$allReplies", as: "ar", cond: { $eq: ["$$ar._id", "$$rId"] } } }, 0] }
                        },
                        in: {
                          _id: "$$rep._id",
                          text: "$$rep.text",
                          likes: "$$rep.likes",
                          author: { $arrayElemAt: [{ $filter: { input: "$replyAuthors", as: "ra", cond: { $eq: ["$$ra._id", "$$rep.author"] } } }, 0] }
                        }
                      }
                    }
                  }
                },
                author: { $arrayElemAt: [{ $filter: { input: "$commentAuthors", as: "ca", cond: { $eq: ["$$ca._id", "$$c.author"] } } }, 0] }
              }
            }
          }
        }
      },

      // 8️⃣ Extra fields for posts
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
          isLikedByMe: { $in: [myUserObj._id, "$likes"] },
        },
      },

      // 9️⃣ Final projection
      {
        $project: {
          _id: 1,
          caption: 1,
          location: 1,
          media: 1,
          createdAt: 1,
          likesCount: 1,
          commentsCount: 1,
          isLikedByMe: 1,
          "author._id": 1,
          "author.username": 1,
          "author.profilePicture": 1,
          "author.isPrivate": 1,
          "comments._id": 1,
          "comments.text": 1,
          "comments.likes": 1,
          "comments.reply._id": 1,
          "comments.reply.text": 1,
          "comments.reply.likes": 1,
          "comments.reply.author._id": 1,
          "comments.reply.author.username": 1,
          "comments.reply.author.profilePicture": 1,
          "comments.author._id": 1,
          "comments.author.username": 1,
          "comments.author.profilePicture": 1,
        },
      },

      { $sort: { createdAt: -1 } },
    ])

    res.status(200).json({ data: dbRes })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})



router.post("/posts/create", isLoggedIn, async(req, res) => {
    try {
        const{caption, location, media} = req.body
        if(!media.length)
        {
            throw new Error("Posts must contain atleast one media file")
        }
        const newPost = await Post.create({caption, location, media, author : req.user._id})
        req.user.posts.push(newPost._id)
        await req.user.save()
        res.status(201).json({msg : "done", data : newPost})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})

router.get("/posts", isLoggedIn, async(req, res) => {
    try {
        const allPosts = await Post.find({author : req.user._id})
        res.status(200).json({data : allPosts})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})

router.get("/posts/:id", isLoggedIn, isAuthor, async(req, res) => {
    try {
        const{id} = req.params
        const foundData = await Post.findOne({
            $and : [
                {_id : id},
                {author : req.user._id}
            ]}
        )
        if(!foundData)
        {
            throw new Error("Invalid Operation")
        }
        res.status(200).json({data : foundData})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})

router.delete("/posts/:id", isLoggedIn, isAuthor, async(req, res) => {
    try {
        const{id} = req.params
        await Post.deleteOne({_id : id})
        res.status(200).json({msg : "done"})
    } catch (error) {
        res.status(400).json({msg : error.message})
    }
})

router.patch("/posts/:id", isLoggedIn, isAuthor, async(req , res) => {
    try {
        const{id} = req.params
        const{caption, location} = req.body
        const updatedPost = await Post.findByIdAndUpdate(id, {caption, location}, {returnDocument:"after"})
        if(!updatedPost)
        {
            throw new Error("Post not found")
        }

        res.status(200).json({msg : "done", data : updatedPost})
    } catch (error) {
        res.status(400).json({msg : error.message})
    }
})

router.patch("/posts/:id/like", isLoggedIn ,async(req, res) => {
    try {
        const{id} = req.params
        const foundPost = await Post.findById(id).populate("author")
        if(!foundPost)
        {
            throw new Error("Post not found")
        }

        if (foundPost.likes.some(id => id.equals(req.user._id))) {
            throw new Error("Post already liked");
        }
        if (foundPost.author.isPrivate) {
            if (foundPost.author.followers.some(id => id.equals(req.user._id)) || foundPost.author._id.toString() == req.user._id.toString()) {
                foundPost.likes.push(req.user._id)
                foundPost.save()
            }
            else
            {
                throw new Error("Invalid Operation")
            }
        }
        else
        {
            foundPost.likes.push(req.user._id)
            foundPost.save()
        }

        res.status(200).json({msg : "done", data : foundPost})

    } catch (error) {
        res.status(400).json({error : error.message})
    }
})

router.patch("/posts/:id/unlike", isLoggedIn, async(req, res) => {
    try {
        const{id} = req.params
        const foundPost = await Post.findById(id).populate("author")
        if(!foundPost)
        {
            throw new Error("Post not found")
        }

        if (
        foundPost.author.isPrivate &&
        !foundPost.author.followers.some(id => id.toString() === req.user._id.toString())
        ) {
        throw new Error("Invalid Operation");
        }

       if (foundPost.likes.some(id => id.toString() === req.user._id.toString())) {
            const filteredLikes = foundPost.likes.filter(item => 
                item.toString() !== req.user._id.toString()
            );

            foundPost.likes = filteredLikes;
            await foundPost.save();
        } else {
            throw new Error("Invalid Operation");
        }
        res.status(200).json({msg : "done", data : foundPost})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})





module.exports = {
    PostRouter : router
}