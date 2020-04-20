/**** External libraries ****/
const express = require('express'); // The express.js library for implementing the API
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

/**** Configuration ****/
const port = process.env.PORT || 8080; // Pick port 8080 if the PORT env variable is empty.
const app = express(); // Get the express app object.

app.use(cors()); // Avoid CORS errors. https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
app.use(bodyParser.json()); // Add middleware that parses JSON from the request body.
app.use(morgan('combined')); // Add middleware that logs all http requests to the console.
app.use(express.static('../qa-client/build'))


/**** Database ****/
const qaDb = require("./qa_db")(mongoose)


/**** Routes ****/
app.get("/api/questions", (req, res) => {

    qaDb.getQuestions().then(questions => res.json(questions));
});

app.get("/api/questions/:id", (req, res) => {
    const id = req.params.id;
    qaDb.getQuestion(id).then(question => res.json(question));
});


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

// "Redirect" all get requests (except for the routes specified above) to React's entry point (index.html) to be handled by Reach router
// It's important to specify this route as the very last one to prevent overriding all of the other routes
app.get('*', (req, res) =>
    res.sendFile(path.resolve('..', 'client', 'build', 'index.html'))
);

/**** Start! ****/


const url = process.env.MONGODB_URL || 'mongodb://localhost/qaDb';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(async () => {
        await qaDb.bootstrap(); // Fill in test data if needed.
        await app.listen(port); // Start the API
        console.log(`qa API running on port ${port}!`);
    })
    .catch(error => console.error(error));
