import React, { Component } from "react";
import { Router } from "@reach/router";
import Question from "./Question";
import Questions from "./Questions";

class App extends Component {
    // API url from the file '.env' OR the file '.env.development'.
    // The first file is only used in production.
    API_URL = process.env.REACT_APP_API_URL;
    constructor(props) {
        super(props);
        this.state = {
            questions: []
        };
    }

    componentDidMount() {
        // Get everything from the API
        this.getData();
    }
//http://localhost:8080/
    async getData() {

        let url = `${this.API_URL}/questions`; // URL of the API.
        let result = await fetch(url); // Get the data
        let json = await result.json(); // Turn it into json

        return this.setState({
            // Set it in the state
            questions: json
        });
    }

    getQuestion(id) {
        // Find the relevant question by id
        return this.state.questions.find(q => q._id === id);
    }

    // method for posting a question
    async askQuestion(question) {
        this.postData(question);
    }

    // the above method calls this method for the post request
    async postData(question) {
        let url = `${this.API_URL}/questions`;
        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                question: question
            }),
            headers: {
                "Content-type": "application/json"
            }
        })
            .then(res => res.json())
            .then(() => {
                this.getData();
            });
    }

    // post new comments
    postAnswer(id, text) {
        let url = `${this.API_URL}/questions/${id}/answers/`;

        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                text: text
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(() => {
                this.getData();
            });
    }


    async vote(id, answerId) {
        let url = `${this.API_URL}/questions/${id}/answers/${answerId}/vote`;
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            }
        })
            .then(response => response.json())
            .then(() => {
                this.getData();
            });
    }


    handleVote(id, answerId) {
        this.vote(id, answerId);
    }

    render() {
        return (
            <div className="container">
                <div className="header">

                </div>
                <div className="question-wrapper">
                    <Router>
                        <Question
                            path="/question/:id"
                            getquestion={id => this.getQuestion(id)}
                            handleVote={(id, answerId) => this.handleVote(id, answerId)}
                            postAnswer={(id, text) => this.postAnswer(id, text)}
                        />
                        <Questions
                            path="/"
                            questions={this.state.questions}
                            askQuestion={question => this.askQuestion(question)}
                        />
                    </Router>
                </div>
            </div>
        );
    }
}

export default App;