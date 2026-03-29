const express = require('express');
const app = express();
const path = require("path");

const blogs = [
    {
        id: 1,
        title: 'My name is Rizwan Khan',
        body: 'Rizwan, a man with Aspergers syndrome, marries Mandira. When unfortunate events unfold after the twin tower attacks, he embarks on a journey to change peoples perception of his community.'
    },
    {
        id: 2,
        title: 'Shah Rukh Khan new Movie Pathan',
        body: 'Pathaan is an upcoming Indian Hindi-language action thriller film directed by Siddharth Anand from a screenplay by Shridhar Raghavan and a story by Anand. Produced by Aditya Chopra for Yash Raj Films, it is the fourth installment in the YRF Spy Universe and stars Shah Rukh Khan, Deepika Padukone and John Abraham.'
    },
    {
        id: 3,
        title: 'Apple is launching new Version',
        body: 'Apple Inc. is an American multinational technology company headquartered in Cupertino, California, United States. Apple is the largest technology company by revenue (totaling US$365.8 billion in 2021) and, as of June 2022, is the worlds biggest company by market capitalization, the fourth-largest personal computer vendor by unit sales and second-largest mobile phone manufacturer. It is one of the Big Five American information technology companies, alongside Alphabet, Amazon, Meta, and Microsoft.'
    }
];

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get(`/`, (req, res) => {

    console.log(req.params)

    res.render("index", {
        blogs,
        blog: blogs[0]
    });
});

app.get(`/:id`, (req, res) => {

    console.log(req.params)

    const blog = blogs.find(blog => blog.id == req.params.id);

    res.render("index", {
        blogs,
        blog
    });
});

app.listen(4000, () => {
    console.log(`listening on port 4000`);
})