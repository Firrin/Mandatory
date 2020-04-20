import React, {Component} from 'react';
import {Link} from '@reach/router';
import AskQuestion from "./AskQuestion";
class Questions extends Component {
    render() {
        const questions = this.props.questions.map(question =>
            <li key={question._id}>
                <Link to={`/question/${question._id}`}>{question.question}</Link>
            </li>
        );
        return (
            <>
                <AskQuestion
                    askQuestion={question => this.props.askQuestion(question)}
                ></AskQuestion>
                <h2>Questions</h2>
            <ul>
                {questions}
            </ul>

            </>
        );
    }
}

export default Questions;

