const fs = require("fs")
const csv = require("csv-parser")
const description = ["Impacts on Humans", "Initial Description of the Event", "Current Description of the Event"]
const express = require("express")
const router = express.Router();
const Base64 = require("../models/Base64")
const axios = require('axios');
const FormData = require('form-data')
const base64 = require("../models/Base64")
const despo = require("../models/Desp")
const gt = async () => {
    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream("../backend/assets/space_natural_calamities.csv")
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}
router.post(
    "/addbase",
    async (req, res) => {
        const data = await gt()
        try {
            for (let i of data) {
                const base64s = []
                for (let j = 0; j < 3; j++) {
                    const payload = {
                        prompt: i[description[j]],
                        output_format: "png"
                    };
                    console.log(i[description[j]])
                    const response = await axios.postForm(
                        `https://api.stability.ai/v2beta/stable-image/generate/ultra`,
                        axios.toFormData(payload, new FormData()),
                        {
                            validateStatus: undefined,
                            responseType: "arraybuffer",
                            headers: {
                                Authorization: `Bearer`,
                                Accept: "image/*"
                            },
                        },
                    );
                    if (response.status === 200) {
                        const imageBuffer = Buffer.from(response.data)
                        const imagebase64 = imageBuffer.toString('base64')
                        // fs.writeFileSync("./lighthouse.webp", Buffer.from(response.data));
                        base64s[j] = imagebase64
                    } else {
                        throw new Error(`${response.status}: ${response.data.toString()}`);
                    }
                }
                let image64 = await Base64.create({
                    intialstate: "data:image/png;base64," + base64s[0],
                    midstate: "data:image/png;base64,"+base64s[1],
                    humanaffect: "data:image/png;base64," +base64s[2],
                })
                base64s = []
            }
        }
        catch (error) {
            res.status(400).json({ error: error.message })
        }
    }
)

// fetching all messages for a receiver of a particular sender  at root /api/baseimg
router.post(
    "/fetchall",
    async (req, res) => {
        console.log("yes")
        try {
            let image64s = await base64.find()
            console.log(image64s)
            res.json(image64s)
        }
        catch (error) {
            res.status(400).json({ error: error.message })
        }
    }
)


router.post(
    "/pushdesp",
    async (req,res) => {
        console.log("yes")
        const data  = await gt()
        for(let i of data){
            const desps =[]
            for(let j = 0 ; j < 3 ; j++){
                let response = await fetch("http://localhost:5000/api/chat/spacebot",{
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify({prompt_ : "Give me breif about " + i[description[j]]} + " max 50 words")
                })
                let data = await response.json()
                console.log(data)
                desps[j] = response.responseFromAi
            }
            let despr = await despo.create({
                intialstate : desps[0],
                midstate : desps[1],
                humanaffect : desps[2]
            })
            desps = []
        }
    }
)


module.exports = router