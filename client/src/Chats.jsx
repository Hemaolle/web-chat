import React, { Component } from 'react';
import Popup from 'react-popup';

class Chats extends Component {

  constructor(props) {
    super(props);

    this.promptUsersToChatWith = this.promptUsersToChatWith.bind(this);
  }

  promptUsersToChatWith() {
    var options = this.props.users.map((user) =>
      ({ value: user.id, label: user.name }));
    Popup.plugins().select('Start a chat with', options,
      (userId) => this.props.onChatStart(userId));
  }

  render() {
    var chats = this.props.chats.map((chat) =>
      <li key={chat.chatId}><button>{chat.username}</button></li>);
    return (
      <div className="Chats">
        <h3>People</h3>
        <ul>
          {chats}
        </ul>
        <button onClick={this.promptUsersToChatWith}>Find people</button>
      </div>
    );
  }
}

export default Chats;