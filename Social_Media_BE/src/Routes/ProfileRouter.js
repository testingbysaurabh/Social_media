const express = require("express")
const router = express.Router()
const{isLoggedIn} = require("../Middlewares/IsLoggedIn")
const { User } = require("../Models/User")
const { FollowRequest } = require("../Models/FollowRequests")


router.patch("/profile/:userId", isLoggedIn, async(req, res) => {
    try {
        const{firstName, lastName, bio} = req.body
        const{userId} = req.params

        if(userId != req.user._id.toString())
        {
            throw new Error("Invalid Operation / Access Denied")
        }
        const updatedUser = await User.findByIdAndUpdate(userId, {firstName, lastName, bio}, {new : true}).select("firstName lastName mail username gender dateOfBirth profilePicture followers following blocked isPrivate posts bio").populate("posts")
        // console.log(updatedUser)
        res.status(200).json({msg : "done", data : updatedUser})


    } catch (error) {
        res.status(400).json({error : error.message})
    }
})



router.patch("/profile/:userId/profile-picture", isLoggedIn, async(req, res) => {
    try {
        const{profilePicture} = req.body
        const{userId} = req.params
        if(userId != req.user._id.toString())
        {
            throw new Error("Invalid Operation / Access Denied")
        }
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePicture}, {new : true}).select("firstName lastName mail username gender dateOfBirth profilePicture followers following blocked isPrivate posts bio").populate("posts")
        res.status(200).json({msg : "done", data : updatedUser})

    } catch (error) {
        res.status(400).json({error : error.message})
        
    }
})



router.patch("/profile/:userId/privacy", isLoggedIn, async(req, res) => {
    try {
        const{isPrivate} = req.body
        // console.log(privacy)  
        req.user.isPrivate = isPrivate
        req.user.save()
        res.status(200).json({msg : "done", data : req.user})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})


router.get("/profile/:userId", isLoggedIn, async(req, res) => {
    try {
        const{userId} = req.params
        const foundUser = await User.findById(userId).populate("posts")

        if(!foundUser)
        {
            throw new Error("Account does not exist")
        }

        const {
            firstName,
            lastName,
            username,
            // mail,
            // password,
            // dateOfBirth,
            // gender,
            bio,
            profilePicture,
            posts,
            followers,
            following,
            // blocked,
            isPrivate
            } = foundUser


            const isFollowing = req.user.following.some(item => item.toString() == userId)
            const isReqSent = await FollowRequest.findOne({
                toUserId : userId,
                fromUserId : req.user._id,
                status : "pending"
            })


        if(foundUser.isPrivate && !isFollowing)
        {
            res.status(200).json({msg : "done, isPrivate", data : {firstName, lastName, username, profilePicture, bio, posts : new Array(posts.length).fill(-1), followers : new Array(followers.length).fill(-1), following : new Array(following.length).fill(-1), isPrivate, reqAlreadySent : (isReqSent ? true : false)}})
        }
        else
        {
            res.status(200).json({msg : "done", data : {firstName, lastName, username, bio, profilePicture, posts, followers, following, isPrivate}})
        }
    } catch (error) {
        
    }
})



module.exports = {
    ProfileRouter : router
}