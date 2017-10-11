import React, { Component } from 'react';

class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {text: '' };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTextChange(e) {
    this.setState({text: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    var text = this.state.text.trim();
    if (!text) {
      return;
    }
    this.props.onMessageSubmit({content: text});
    this.setState({text: ''});
  }

  render() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="submit" value="Post" className="submit"/>
        <span className="inputContainer"> 
          <input
            type="text"
            placeholder="Say something..."
            value={this.state.text}
            onChange={this.handleTextChange}
            className="input" />
        </span>        
      </form>
    );
  }
}

export default MessageInput;