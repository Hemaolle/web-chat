import React, { Component } from 'react';
import Popup from 'react-popup';

class Username extends Component {
  constructor(props) {
    super(props);
    this.promptUsername = this.promptUsername.bind(this);
  }

  componentDidMount() {
    if (!this.props.username)
      {
        this.promptUsername();
      }
  }

  promptUsername() {
    Popup.plugins().prompt('', 'Type your name', function (value) {
      this.props.onUsernameChange(value);
    }.bind(this));
  }

  render() {
    return this.props.username ?
      (<div>
        Logged in as <b>{this.props.username}</b> <button onClick={this.promptUsername}>Change</button>
      </div>)
      : null;
  }
}

export default Username;