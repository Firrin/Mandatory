import React, { Component } from "react";

class AskQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            input: ""
        };

        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.setState({
            input: e.target.value
        });
    }

    onClick() {
        this.props.askQuestion(this.state.input);
        document.getElementById("input-askQuestion").value = ""
    }

    render() {
        return (
            <>
                <h2>Post Question</h2>
                <div className="post">
          <input id="input-askQuestion"
              onChange={this.onChange}
          ></input>
                    <button onClick={this.onClick}>Post Question</button>
                </div>
            </>
        );
    }
}

export default AskQuestion;
