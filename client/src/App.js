import React, { Component } from 'react'
import './App.css';
import xhr from 'xhr';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
    this.loadMessagesFromServer = this.loadMessagesFromServer.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
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

  render() {
    return (
      <div className="App">
        <MessageTable messages={this.state.messages}/>
        <MessageInput onMessageSubmit={this.handleMessageSubmit}/>
      </div>
    );
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
    this.state = { author: '', text: '' };
    this.handleAuthorChange = this.handleAuthorChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleAuthorChange(e) {
    this.setState({author: e.target.value});
  }

  handleTextChange(e) {
    this.setState({text: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onMessageSubmit({author: author, content: text});
    this.setState({author: '', text: ''});
  }

  render() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
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
