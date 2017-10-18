import React, { Component } from 'react';

class MessageTable extends Component {
  render() {
    var messages = this.props.messages;
    var messageRows = null;
    if (messages) {
     messageRows = messages.map((message) =>
        <MessageRow message={message}
                    key={message.id} />);
    }

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
    var sender = message.author;
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

export default MessageTable;