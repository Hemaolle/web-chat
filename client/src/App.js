import React, { Component } from 'react'
import './App.css';
import { messages } from './mock-data.js';
import xhr from 'xhr';

class App extends Component {
  render() {
    xhr.get('/api', function(err, resp) {
      console.log(resp.body)
    })

    return (
      <div className="App">
        <MessageTable messages={messages}/>      
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
