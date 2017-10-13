import React, { Component } from 'react';
import 'react-select/dist/react-select.css';
import './App.css';
import xhr from 'xhr';
import './Prompt.jsx';
import './SelectPopup.jsx'
import Username from './Username.jsx';
import MessageTable from './MessageTable.jsx';
import MessageInput from './MessageInput.jsx';
import Channels from './Channels.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      username: localStorage.getItem('username'),
      channels: [],
      currentChannel: {id: 1}
    };
    this.loadMessagesFromServer = this.loadMessagesFromServer.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.loadChannelsFromServer = this.loadChannelsFromServer.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleChannelAdd = this.handleChannelAdd.bind(this);
    this.handleChannelChange = this.handleChannelChange.bind(this);
  }

  componentDidMount() {
    this.loadMessagesFromServer(this.state.currentChannel);
    this.loadChannelsFromServer();
    setInterval(
      () => this.loadMessagesFromServer(this.state.currentChannel),
      this.props.pollInterval);
  }

  loadMessagesFromServer(channel) {
    xhr.get(`http://localhost:3001/api/messages?channelId=${channel.id}`,
      {json: true},
      function(err, resp) {
      if (err) {
        console.error(err);
      }
      else {
        var messages = resp.body;
        this.setState({messages: messages})
      }      
    }.bind(this));
  }

  handleMessageSubmit(message) {
    message.author = this.state.username;
    message.channelId = this.state.currentChannel.id;
    xhr.post('http://localhost:3001/api/message', {
      json: true,
      body: message
    }, function(err, resp) {
      if (err) {
        console.error(err);
      }
      else {
        var messages = resp.body;
        this.setState({messages: messages})
      } 
    }.bind(this));
  }

  loadChannelsFromServer() {
    xhr.get('http://localhost:3001/api/channels',
      {json: true},
      function(err, resp) {
      if (err) {
        console.error(err);
      }
      else {
        var channels = resp.body;
        this.setState(
          {channels: channels,
           currentChannel: channels[0]});
      }      
    }.bind(this));
  }

  handleUsernameChange(username) {
    localStorage.setItem('username', username);
    this.setState({username: username});
    xhr.post('http://localhost:3001/api/user', {
      json: true,
      body: {name: username}
    }, function(err, resp) {
      if (err) {
        console.error(err);
      }
      else {
        console.log("User id: " + resp.body.userId);
      } 
    }.bind(this));
  }

  handleChannelAdd(channel) {
    xhr.post('http://localhost:3001/api/channel', {
      json: true,
      body: channel
    }, function(err, resp) {
      if (err) {
        console.error(err);
      }
      else {
        var channels = resp.body;
        this.setState({channels: channels})
      } 
    }.bind(this));
  }

  handleChannelChange(channel) {
    this.setState({currentChannel: channel});

    // Note that the state doesn't change immediately, so we can't take
    // the channel from the current state.
    this.loadMessagesFromServer(channel);
  }

  render() {
    return (
      <div className="App wrapper">
        <div className="header">
          <Username username={this.state.username}
            onUsernameChange={this.handleUsernameChange}/>
        </div>
        <div className="mainContent">
          <Channels channels={this.state.channels}
            currentChannel={this.state.currentChannel}
            onChannelAdd={this.handleChannelAdd}
            onChannelSelect={(channel) => this.handleChannelChange(channel)}/>            
          <div className="box messaging">
            <MessageTable messages={this.state.messages}/>
            <MessageInput onMessageSubmit={this.handleMessageSubmit}/>
          </div>
        </div>
        
      </div>
    );
  }
}

export default App;
