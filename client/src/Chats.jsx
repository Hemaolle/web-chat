import React, { Component } from 'react';
import Popup from 'react-popup';

class Chats extends Component {

  constructor(props) {
    super(props);

    this.promptUsersToChatWith = this.promptUsersToChatWith.bind(this);
  }

  promptUsersToChatWith() {
    var otherUsers = this.props.users.filter(
      (user) => !(this.props.user.id === user.id));
    var availableUsers = otherUsers.filter(
      (user) => !this.chattingWith(user));
    var options = availableUsers.map((user) =>
      ({ value: user.id, label: user.name }));
    Popup.plugins().select('Start a chat with', options,
      (userId) => this.props.onChatStart(userId));
  }

  chattingWith(user) {
    return this.props.chats.some(chat => chat.userId === user.id);
  }

  render() {
    var chats = null;
    if (this.props.chats)
    {
      chats = this.props.chats.map((chat) =>
        <li key={chat.channelId}>
          {this.props.currentChannel 
            && chat.channelId === this.props.currentChannel.id ?
            chat.username
            : (<button onClick={() => this.props.onChatSelect({id: chat.channelId})}>
               {chat.username}
             </button>)}
        </li>);
    }

    // Don't show the button unless we have the required list of other users.
    var newChatButton = null;
    if (this.props.users && this.props.chats && this.props.user) {
        newChatButton = (
          <button onClick={this.promptUsersToChatWith}>
            Find people
          </button>);
    }

    return (
      <div className="Chats">
        <h3>People</h3>
        <ul>
          {chats}
        </ul>
        {newChatButton}
      </div>
    );
  }
}

export default Chats;