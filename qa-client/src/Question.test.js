import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Question from './question';


const questions = {
    id: 13,
    question: "What is a test",
    answers: [{
        text: "this is a test",
        votes: 10
    }
    ]
}

it('Name of the question will be rendered', () => {
    const comp = <Question getquestion = {_ => questions}/>
    const {getByText} = render(comp);
    expect(getByText(questions.question)).toBeInTheDocument()
});
it('renders the "Answers" header', () => {
    const comp = <Question getquestion={_ => questions}/>;
    const {getByText} = render(comp);
    expect(getByText("answers:")).toBeInTheDocument();
});

