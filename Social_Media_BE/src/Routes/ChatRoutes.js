const express = require("express")
const { isLoggedIn } = require("../Middlewares/IsLoggedIn")
const { Msg } = require("../Models/Msg")
const { Conversation } = require("../Models/Conversations")
const router = express.Router()


router.get("/chats", isLoggedIn, async(req, res) => {
    try {
        const foundConversations  = await Conversation.find({
            $or : [
                {sender : req.user._id},
                {receiver : req.user._id}
            ]
        }).populate("sender receiver")

        res.status(200).json({data : foundConversations})
    } catch (error) {
        res.status(400).json({error : error.message})
        
    }
})

router.get("/chats/:id", isLoggedIn, async(req, res) => {
    try {
    
        const{id} = req.params

        const chats = await Msg.find({
            $or : [
                {sender : id, receiver : req.user._id},
                {sender : req.user._id, receiver : id}
            ]
        })

        res.status(200).json({chats})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})


router.patch("/chats/:id", isLoggedIn, async(req, res) => {
    try {
        const{text} = req.body
        const{id} = req.params
        const foundConversation = await Conversation.findOne({
            $or : [
                {sender : req.user._id, receiver : id},
                {sender : id, receiver : req.user._id}
            ]
        })

        if(!foundConversation)
        {
            res.status(200).json({msg : "no conversation happened"})
        }

        foundConversation.lastMsg = text
        await foundConversation.save()
        res.status(200).json({msg : "done"})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})







module.exports = {
    chatRouter : router
}