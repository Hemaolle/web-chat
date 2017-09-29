import React, { Component } from 'react'
import './App.css';
import xhr from 'xhr';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
    this.loadMessagesFromServer = this.loadMessagesFromServer.bind(this);
  }

  componentDidMount() {
    this.loadMessagesFromServer();
    setInterval(this.loadMessagesFromServer, this.props.pollInterval);
  }

  loadMessagesFromServer() {
    xhr.get('http://localhost:3001/api/messages', function(err, resp) {
      if (err) {
        console.error(err);
      }
      else {
        var messages = JSON.parse(resp.body);
        this.setState({messages: messages})
      }      
    }.bind(this));
  }

  render() {
    return (
      <div className="App">
        <MessageTable messages={this.state.messages}/>      
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

export default App;
