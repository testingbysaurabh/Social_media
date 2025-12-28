require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require('mongoose')
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { OtpRouter } = require("./Routes/OtpRoutes")
const { AuthRouter } = require("./Routes/AuthRoutes")
const { PostRouter } = require("./Routes/PostRoutes")
const { FollowReqRouter } = require("./Routes/FollowReqRoutes")
const { CommentRouter } = require("./Routes/CommentsRouter")
const { ProfileRouter } = require("./Routes/ProfileRouter")
const http = require("http")
const fn = require("socket.io")
const { Msg } = require("./Models/Msg")
const { chatRouter } = require("./Routes/ChatRoutes")
const { Conversation } = require("./Models/Conversations")




const server = http.createServer(app)
const io = fn(server, {
    cors: {
        origin: true // reflect request origin
    }
})


io.on("connection", (socket) => {


    socket.on("join-room", ({ sender, receiver }) => {
        const roomId = [sender.trim(), receiver.trim()].sort().join("")
        socket.join(roomId)


        socket.on("send-msg", async ({ sender, receiver, text }) => {

            const foundConversation = await Conversation.findOne({
                $or: [
                    { sender, receiver },
                    { sender: receiver, receiver: sender }
                ]
            })

            // console.log(foundConversation)

            if (!foundConversation) {
                await Conversation.create({
                    sender, receiver, lastMsg: text
                })
            }

            foundConversation.lastMsg = text
            await foundConversation.save()

            await Msg.create({
                sender, receiver, text
            })
            socket.to(roomId).emit("receive-msg", { sender, receiver, text })


        })



    })


})




app.set("trust proxy", 1)
app.use(cors({
    origin: true, // reflect request origin
    credentials: true
}))
// app.use(express.json())
app.use(cookieParser())
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use("/api", OtpRouter)
app.use("/api", AuthRouter)
app.use("/api", PostRouter)
app.use("/api", FollowReqRouter)
app.use("/api", CommentRouter)
app.use("/api", ProfileRouter)
app.use("/api", chatRouter)



mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("DB Connected")
        server.listen(process.env.PORT, () => {
            console.log("Server Running")
        })
    })
    .catch(() => {
        console.log("DB Connection Failed")
    })











