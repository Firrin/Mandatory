import React, { Component } from "react";
import { Link } from "@reach/router";

import PostAnswer from "./PostAnswer";

class Question extends Component {
    constructor(props) {
        super(props);
        this.handleVote = this.handleVote.bind(this);
    }

    handleVote(e) {
        let answerId = e.currentTarget.dataset.id;
        this.props.handleVote(this.props.id, answerId);
    }

    render() {
        const question = this.props.getquestion(this.props.id);

        let content = <p>Loading</p>;
        if (question) {
            content = (
                <>
                    <h1>{question.question}</h1>
                    <h3>answers:</h3>
                    <ul>
                        {question.answers.map(h => (
                            <div key={h._id}>

                                    <h3>{h.text}</h3>
                                    <p>Votes: {h.votes}</p>
                                    <button
                                        onClick={() => this.props.handleVote(this.props.id, h._id)}>
                                        <span>Upvote this answer</span>
                                    </button>
                            </div>
                        ))}
                    </ul>
                    <PostAnswer
                        id={this.props.id}
                        postAnswer={(id, text) => this.props.postAnswer(id, text)}
                    />
                    <Link to="/">Back</Link>
                </>
            );
        }

        return content;
    }
}

export default Question;
