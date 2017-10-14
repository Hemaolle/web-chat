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
      user: localStorage.getItem('user'),
      myChannels: [],
      allChannels: [],
      currentChannel: {id: 1}
    };
    this.loadMessagesFromServer = this.loadMessagesFromServer.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.loadChannelsFromServer = this.loadChannelsFromServer.bind(this);
    this.loadUserChannelsFromServer = this.loadUserChannelsFromServer.bind(this);
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
    if (channel) {
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
  }

  handleMessageSubmit(message) {
    message.author = this.state.user.username;
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
          {allChannels: channels});
      }      
    }.bind(this));
  }

  loadUserChannelsFromServer(userId) {
    console.log(userId);
    xhr.get(`http://localhost:3001/api/user/${userId}/channels`,
      {json: true},
      function(err, resp) {
      if (err) {
        console.error(err);
      }
      else {
        var channels = resp.body;
        this.setState(
          {myChannels: channels,
           currentChannel: channels[0]});
      }      
    }.bind(this));
  }

  handleUsernameChange(username) {
    xhr.post('http://localhost:3001/api/user', {
      json: true,
      body: {name: username}
    }, function(err, resp) {
      if (err) {
        console.error(err);
      }
      else {
        var user = {name: username, id:resp.body.id};
        this.setState({user: user});
        localStorage.setItem('user', user);
        console.log("username change id " + user.id)
        this.loadUserChannelsFromServer(user.id);
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

  handleChannelJoin(channelId) {
    xhr.post(`http://localhost:3001/api/channel/${channelId}/join`, {
      json: true,
      body: {userId: this.state.user.id}
    }, function(err, resp) {
      if (err) {
        console.error(err);
      }
      else {
        var channels = resp.body;
        this.setState({myChannels: channels})
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
          <Username user={this.state.user}
            onUsernameChange={this.handleUsernameChange}/>
        </div>
        <div className="mainContent">
          <Channels myChannels={this.state.myChannels}
            allChannels={this.state.allChannels}
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
