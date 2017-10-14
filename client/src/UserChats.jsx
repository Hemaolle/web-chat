import React, { Component } from 'react';
import Popup from 'react-popup';

class UserChats extends Component {

  constructor(props) {
    super(props);

    this.promptUsersToChatWith = this.promptUsersToChatWith.bind(this);
  }

  promptUsersToChatWith() {
    var options = this.props.users.map((user) =>
      ({ value: user.id, label: user.name }));
    Popup.plugins().select('Start a chat with', options,
      (userId) => this.props.onUserChatStart(userId));
  }

  render() {    
    return (
      <div className="UserChats">
        <h3>People</h3>
        <ul>
          {//userChats
          }
        </ul>
        <button onClick={this.promptUsersToChatWith}>Find people</button>
      </div>
    );
  }
}

export default UserChats;