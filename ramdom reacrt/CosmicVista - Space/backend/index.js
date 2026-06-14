const express = require("express");
const cors = require("cors");
const connectToMongo = require("./database.js")
connectToMongo();
const app = express();
app.use(cors());
app.use(express.json());
const port = 5000
const server = app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

// routes of backend

app.use("/api/chat",require("./routes/genai.js"))
app.use("/api/message" ,require("./routes/Chat.js"))
app.use("/api/baseimg",require("./routes/BaseImage.js"))