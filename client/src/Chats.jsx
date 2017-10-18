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
      <li key={chat.channelId}>
        {this.props.currentChannel 
          && chat.channelId === this.props.currentChannel.id ?
          chat.username
          : (<button onClick={() => this.props.onChatSelect({id: chat.channelId})}>
             {chat.username}
           </button>)}
      </li>);

    // Don't show the button unless we have the required list of other users.
    var newChatButton = 
      this.props.users ?
        (<button onClick={this.promptUsersToChatWith}>Find people</button>)
        : null;

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