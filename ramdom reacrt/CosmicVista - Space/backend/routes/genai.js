const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("");
const express = require("express")
const router = express.Router()
run = async (prompt_) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const result = await model.generateContent(prompt_);
    const response = await result.response;
    const text = response.text();
    const response1 = text.replace(/\*/g,'')
    return response1.slice(0,150)
  }

router.post(
    "/spacebot",
    async (req,res) => {
        try {
            let responseFromAi  = await run(req.body.prompt_)
            res.json({responseFromAi})
        }
        catch{
           console.log("Error occured") 
        }
    }
)

module.exports = router