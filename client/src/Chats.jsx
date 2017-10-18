import React, { Component } from 'react';
import Popup from 'react-popup';
import ChatControls from './ChatControls.jsx'

class Chats extends Component {

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

    return (
      <div className="Chats">
        <h3>People</h3>
        <ul>
          {chats}
        </ul>
          <ChatControls
            users={this.props.users}
            chats={this.props.chats}
            user={this.props.user}
            onChatStart={this.props.onChatStart}
            onChatSelect={this.props.onChatSelect}/>
      </div>
    );
  }
}

export default Chats;