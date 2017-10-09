import React, { Component } from 'react';
import './App.css';
import xhr from 'xhr';
import './username-popup.js'
import Popup from 'react-popup';

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

class Username extends Component {
  constructor(props) {
    super(props);
    this.promptUsername = this.promptUsername.bind(this);
  }

  componentDidMount() {
    if (!this.props.username)
      {
        this.promptUsername();
      }
  }

  promptUsername() {
    Popup.plugins().prompt('', 'Type your name', function (value) {
      this.props.onUsernameChange(value);
    }.bind(this));
  }

  render() {
    return this.props.username ?
      (<div>
        Logged in as <b>{this.props.username}</b> <button onClick={this.promptUsername}>Change</button>
      </div>)
      : null;
  }
}

class MessageTable extends Component {  
  render() {
    var messages = this.props.messages;
    var messageRows = messages.map((message) =>
        <MessageRow message={message}
                    key={message.id} />);

    return (
      <table className="MessageTable">
          <tbody>          
              {messageRows}
          </tbody>
      </table>
      );
  }
}

class MessageRow extends Component {
  render() {
    var message = this.props.message;
    var sender = message.sender;
    var timestamp = message.timestamp;
    var content = message.content;

    return (      
      <tr className="MessageRow">
        <td>{sender} ({timestamp}):</td>
        <td>{content}</td>              
      </tr>
      );
  }
}

class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {text: '' };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTextChange(e) {
    this.setState({text: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    var text = this.state.text.trim();
    if (!text) {
      return;
    }
    this.props.onMessageSubmit({content: text});
    this.setState({text: ''});
  }

  render() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
}

export default App;
