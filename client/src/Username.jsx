import React, { Component } from 'react';
import Popup from 'react-popup';

class Username extends Component {
  constructor(props) {
    super(props);
    this.promptUsername = this.promptUsername.bind(this);
  }

  componentDidMount() {
    if (!this.props.user)
      {
        this.promptUsername();
      }
  }

  promptUsername() {
    Popup.plugins().prompt('What\'s your name?', '', 'Type your name', function (value) {
      this.props.onUsernameChange(value);
    }.bind(this));
  }

  render() {
    return this.props.user ?
      (<div className="Username">
        Logged in as <b>{this.props.user.name}</b> <button onClick={this.promptUsername}>Switch</button>
      </div>)
      : null;
  }
}

export default Username;