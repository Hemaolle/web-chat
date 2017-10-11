import React, { Component } from 'react';
import './App.css';
import xhr from 'xhr';
import './username-popup.js'
import Username from './Username.jsx'
import MessageTable from './MessageTable.jsx'
import MessageInput from './MessageInput.jsx'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] , username: localStorage.getItem('username')};
    this.loadMessagesFromServer = this.loadMessagesFromServer.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
  }

  componentDidMount() {
    this.loadMessagesFromServer();
    setInterval(this.loadMessagesFromServer, this.props.pollInterval);
  }

  loadMessagesFromServer() {
    xhr.get('http://localhost:3001/api/messages',
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

  handleUsernameChange(username) {
    localStorage.setItem('username', username);
    this.setState({username: username});
  }

  render() {
    return (
      <div className="App">
        <Username username={this.state.username}
          onUsernameChange={this.handleUsernameChange}/>
        <MessageTable messages={this.state.messages}/>
        <MessageInput onMessageSubmit={this.handleMessageSubmit}/>
      </div>
    );
  }
}

export default App;
