const express = require("express")
const Message = require("../models/Message.js")
const router = express.Router();

// pushing a message at /api/message/addmsg

router.post(
    "/addmsg",
    async (req,res) => {
        console.log(req.body.sender)
        try {
            let msg = await Message.create({
                sender : req.body.sender,
                receiver : req.body.receiver,
                message : req.body.message
            })
            res.json(msg)
        }
        catch (error) {
            res.status(400).json({error : error.message})
        }
    }
)

module.exports = router