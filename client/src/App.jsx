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
    this.state = {
      messages: null,
      user: this.getUserFromLocalStorage(),
      myChannels: null,
      allChannels: null,
      currentChannel: null,
      users: null,
      chats: null
    };
    this.loadMessagesFromServer = this.loadMessagesFromServer.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.loadChannelsFromServer = this.loadChannelsFromServer.bind(this);
    this.loadUserChannelsFromServer = this.loadUserChannelsFromServer.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleChannelAdd = this.handleChannelAdd.bind(this);
    this.handleChannelChange = this.handleChannelChange.bind(this);
    this.handleChannelJoin = this.handleChannelJoin.bind(this);
    this.loadUsers = this.loadUsers.bind(this);
    this.handleChatStart = this.handleChatStart.bind(this);

    this.api = new Api('http://localhost:3001/api', this);
    this.api = new Api(process.env.REACT_APP_API_URL, this);
  }

  getUserFromLocalStorage() {
    var user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  }

  componentDidMount() {
    if (this.state.user)
    {
      this.loadUserChannelsFromServer(this.state.user.id);
    }

    this.startPolling(() => this.loadMessagesFromServer(this.state.currentChannel));
    this.startPolling(() => this.loadChannelsFromServer());
    this.startPolling(() => this.loadUsers());
    this.startPolling(() => this.loadChats());
  }


  startPolling(pollFn) {
    pollFn();
    setInterval(pollFn, this.props.pollInterval);
  }

  loadMessagesFromServer(channel) {
    if (channel) {
      this.api.get(`messages?channelId=${channel.id}`,
        (resp) => {
            var messages = resp.body;
            this.setState({messages: messages})
        });
    }
  }

  handleMessageSubmit(message) {
    message.author = this.state.user.name;
    message.channelId = this.state.currentChannel.id;
    this.api.post('message', message, (resp) => {
        var messages = resp.body;
        this.setState({messages: messages})
      });
  }

  loadChannelsFromServer() {
    this.api.get('channels', (resp) => {
      console.log(resp);
      this.setState({allChannels: resp.body});
    }
    );
  }

  loadUserChannelsFromServer(userId) {
    this.api.get(`user/${userId}/channels`, (resp) =>
      this.setState(
          {myChannels: resp.body,
           currentChannel: resp.body[0]}));
  }

  handleUserChange(username) {
    this.setState({
      messages: null,
      myChannels: null,
      allChannels: null,
      currentChannel: null,
      users: null,
      chats: null
    });

    this.api.post('user', {name: username}, (resp) => {
      var user = {name: username, id:resp.body.id};
      this.setState({user: user});
      localStorage.setItem('user', JSON.stringify(user));
      this.loadUserChannelsFromServer(user.id);
    });
  }

  handleChannelAdd(channel) {
    channel.userId = this.state.user.id;
    this.api.post('channel', channel, (resp) =>
      this.setState({myChannels: resp.body.userChannels,
                     currentChannel: {id: resp.body.createdChannel}}));
  }

  handleChannelJoin(channelId) {
    this.api.post(`channel/${channelId}/join`,
      {userId: this.state.user.id},
      (resp) => this.setState({myChannels: resp.body}));
  }

  handleChannelChange(channel) {
    this.setState({currentChannel: channel});

    // Note that the state doesn't change immediately, so we can't take
    // the channel from the current state.
    this.loadMessagesFromServer(channel);
  }

  loadUsers() {
    this.api.get('users', (resp) =>
      this.setState({users: resp.body}));
  }

  loadChats() {
    if (this.state.user) {
      this.api.get(`user/${this.state.user.id}/chats`, (resp) =>
        this.setState({chats: resp.body}));
    }
  }

  handleChatStart(userId) {
    this.api.post(`user/${userId}/start_chat`,
      {userId: this.state.user.id},
      (resp) => this.setState({chats: resp.body}));
  }

  render() {
    return (
      <div className="App wrapper">
        <div className="header">
          <Username
            user={this.state.user}
            onUsernameChange={this.handleUserChange}/>
        </div>
        <div className="mainContent">
          <div className="sidebar">
            <Channels
              myChannels={this.state.myChannels}
              allChannels={this.state.allChannels}
              currentChannel={this.state.currentChannel}
              onChannelAdd={this.handleChannelAdd}
              onChannelSelect={this.handleChannelChange}
              onChannelJoin={this.handleChannelJoin}/>
            <Chats
              users={this.state.users}
              chats={this.state.chats}
              user={this.state.user}
              onChatStart={this.handleChatStart}
              onChatSelect={this.handleChannelChange}
              currentChannel={this.state.currentChannel}/>
          </div>
          <div className="box messaging">
            <MessageTable messages={this.state.messages}/>
            <MessageInput
              currentChannel={this.state.currentChannel}
              onMessageSubmit={this.handleMessageSubmit}/>
          </div>
        </div>
        
      </div>
    );
  }
}

export default App;
