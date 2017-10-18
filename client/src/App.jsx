import React, { Component } from 'react';
import './App.css';
import './Prompt.jsx';
import './SelectPopup.jsx'
import Username from './Username.jsx';
import MessageTable from './MessageTable.jsx';
import MessageInput from './MessageInput.jsx';
import Channels from './Channels.jsx';
import Chats from './Chats.jsx';
import Api from './Api.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.api = new Api(process.env.REACT_APP_API_URL, this);
    this.state = {
      messages: null,
      user: this.getUserFromLocalStorage(),
      myChannels: null,
      allChannels: null,
      currentChannel: null,
      users: null,
      chats: null
    };
    this.loadMessages = this.loadMessages.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.loadChannels = this.loadChannels.bind(this);
    this.loadUserChannels = this.loadUserChannels.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.addChannel = this.addChannel.bind(this);
    this.changeChannel = this.changeChannel.bind(this);
    this.joinChannel = this.joinChannel.bind(this);
    this.loadUsers = this.loadUsers.bind(this);
    this.startChat = this.startChat.bind(this);    
  }

  getUserFromLocalStorage() {
    var userString = localStorage.getItem('user');

    if (!userString) {
      return null;
    }

    var user = JSON.parse(userString);

    // Post the stored username to the API just in case the
    // database has been wiped in between.
    this.changeUser(user.name);
    return user;
  }

  componentDidMount() {
    if (this.state.user)
    {
      this.loadUserChannels(this.state.user.id);
    }

    this.startPolling(() => this.loadMessages(this.state.currentChannel));
    this.startPolling(() => this.loadChannels());
    this.startPolling(() => this.loadUsers());
    this.startPolling(() => this.loadChats());
  }


  startPolling(pollFn) {
    pollFn();
    setInterval(pollFn, this.props.pollInterval);
  }

  loadMessages(channel) {
    if (channel) {
      this.api.get(`channels/${channel.id}/messages`,
        (resp) => {
            var messages = resp.body;
            this.setState({messages: messages})
        });
    }
  }

  sendMessage(message) {
    message.author = this.state.user.name;
    var channelId = this.state.currentChannel.id;
    this.api.post(`channels/${channelId}/messages`,
      message, (resp) => {
        var messages = resp.body;
        this.setState({messages: messages})
      });
  }

  loadChannels() {
    this.api.get('channels', (resp) => {
      console.log(resp);
      this.setState({allChannels: resp.body});
    }
    );
  }

  loadUserChannels(userId) {
    this.api.get(`users/${userId}/channels`, (resp) =>
      this.setState(
          {myChannels: resp.body,
           currentChannel: resp.body[0]}));
  }

  changeUser(username) {
    this.setState({
      messages: null,
      myChannels: null,
      allChannels: null,
      currentChannel: null,
      users: null,
      chats: null
    });

    this.api.post('users', {name: username}, (resp) => {
      var user = {name: username, id:resp.body.id};
      this.setState({user: user});
      localStorage.setItem('user', JSON.stringify(user));
      this.loadUserChannels(user.id);
    });
  }

  addChannel(channel) {
    channel.userId = this.state.user.id;
    this.api.post('channels', channel, (resp) =>
      this.setState({myChannels: resp.body.userChannels,
                     currentChannel: {id: resp.body.createdChannel}}));
  }

  joinChannel(channelId) {
    this.api.post(`channels/${channelId}/join`,
      {userId: this.state.user.id},
      (resp) => this.setState({myChannels: resp.body}));
  }

  changeChannel(channel) {
    this.setState({currentChannel: channel});

    // Note that the state doesn't change immediately, so we can't take
    // the channel from the current state.
    this.loadMessages(channel);
  }

  loadUsers() {
    this.api.get('users', (resp) =>
      this.setState({users: resp.body}));
  }

  loadChats() {
    if (this.state.user) {
      this.api.get(`users/${this.state.user.id}/chats`, (resp) =>
        this.setState({chats: resp.body}));
    }
  }

  startChat(userId) {
    this.api.post(`users/${userId}/start_chat`,
      {userId: this.state.user.id},
      (resp) => this.setState({chats: resp.body}));
  }

  render() {
    return (
      <div className="App wrapper">
        <div className="header">
          <Username
            user={this.state.user}
            onUsernameChange={this.changeUser}/>
        </div>
        <div className="mainContent">
          <div className="sidebar">
            <Channels
              myChannels={this.state.myChannels}
              allChannels={this.state.allChannels}
              currentChannel={this.state.currentChannel}
              onChannelAdd={this.addChannel}
              onChannelSelect={this.changeChannel}
              onChannelJoin={this.joinChannel}/>
            <Chats
              users={this.state.users}
              chats={this.state.chats}
              user={this.state.user}
              onChatStart={this.startChat}
              onChatSelect={this.changeChannel}
              currentChannel={this.state.currentChannel}/>
          </div>
          <div className="box messaging">
            <MessageTable messages={this.state.messages}/>
            <MessageInput
              currentChannel={this.state.currentChannel}
              onMessageSubmit={this.sendMessage}/>
          </div>
        </div>
        
      </div>
    );
  }
}

export default App;
