/**** External libraries ****/
const express = require('express'); // The express.js library for implementing the API
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
/**** Configuration ****/
const appName = "Q&A"; // Change the name of your server app!
const port = process.env.PORT || 8080; // Pick port 8080 if the PORT env variable is empty.
const app = express(); // Get the express app object.

app.use(bodyParser.json()); // Add middleware that parses JSON from the request body.
app.use(morgan('combined')); // Add middleware that logs all http requests to the console.
app.use(cors()); // Avoid CORS errors. https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
app.use(express.static('../qa-client/build'))


const qaDb = require("./qa_db")(mongoose)

/**** Routes ****/

/**** Routes ****/
app.get("/api/questions", (req, res) => {
    // Get all questions. Put question into json response when it resolves.
    qaDb.getQuestions().then(questions => res.json(questions));
});

// Get question
app.get("/api/questions/:id", (req, res) => {
    const id = req.params.id;
    qaDb.getQuestion(id).then(question => res.json(question));
});

// Post a new question
app.post("/api/questions", (req, res) => {
    const question = {
        question: req.body.question,
        answers: [] // Empty answer array
    };
    qaDb
        .createQuestion(question)
        .then(newquestion => res.json(newquestion));
});

// Post a new answers
app.post("/api/questions/:id/answers", (req, res) => {
    qaDb
        .addAnswer(req.params.id, req.body)
        .then(updatedquestion => res.json(updatedquestion));
});

// Update votes
app.put("/api/questions/:id/answers/:answerId/vote", (req, res) => {
    qaDb
        .vote(req.params.id, req.params.answerId)
        .then(updatedvote => res.json(updatedvote));
});


app.get('*', (req, res) =>
    res.sendFile(path.resolve('..', 'client', 'build', 'index.html'))
);
/*
// PostAnswer
app.post('/api/questions/:id/answers', (req, res) => {
    const id = parseInt(req.params.id);
    const text = req.body.text;
    const question = questions.find(q => q.id === id);
    question.answers.push(text);
    console.log(question);
    res.json({msg: "Answer added", question: question});
});


app.put("/api/questions/:id/comments/:commentId/vote", (req, res) => {
    questionDAL
        .vote(req.params.id, req.params.commentId)
        .then(updatedvote => res.json(updatedvote));
});
*/

/**** Start! ****/

/**** Start ****/
const url = process.env.MONGO_URL || 'mongodb://localhost/qa_db';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(async () => {
        await qaDb.bootstrap(); // Fill in test data if needed.
        await app.listen(port); // Start the API
        console.log(`qa API running on port ${port}!`);
    })
    .catch(error => console.error(error));
