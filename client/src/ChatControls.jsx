import React, { Component } from 'react';
import Popup from 'react-popup';

class ChatControls extends Component {

  constructor(props) {
    super(props);

    this.promptUsersToChatWith = this.promptUsersToChatWith.bind(this);
  }

  promptUsersToChatWith() {
    var otherUsers = this.props.users.filter(
      (user) => !(this.props.user.id === user.id));
    var availableUsers = otherUsers.filter(
      (user) => !this.chattingWith(user));

    if (otherUsers.length === 0) {
      Popup.alert('There is no one else on the server yet.');
      return;
    }

    if (availableUsers.length === 0) {
      Popup.alert('You are already chatting with everyone.')
      return;
    }

    var options = availableUsers.map((user) =>
      ({ value: user.id, label: user.name }));
    Popup.plugins().select('Start a chat with', options,
      (userId) => this.props.onChatStart(userId));
  }

  chattingWith(user) {
    return this.props.chats.some(chat => chat.userId === user.id);
  }

  render() {
    // Don't show the button unless we have the required list of other users.
    var newChatButton = null;
    if (this.props.users && this.props.chats && this.props.user) {
        newChatButton = (
          <button onClick={this.promptUsersToChatWith}>
            Find people
          </button>);
    }

    return newChatButton;
  }
}

export default ChatControls;