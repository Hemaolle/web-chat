import React, { Component } from 'react';
import classNames from 'classnames';
import Popup from 'react-popup';

class Channels extends Component {
  constructor(props) {
    super(props);
    this.promptChannelName = this.promptChannelName.bind(this);
  }

  promptChannelName() {
    Popup.plugins().prompt('Name the new channel', '', 'Type the channel name', function (value) {
      this.props.onChannelAdd({name: value});
    }.bind(this));
  }

  render() {
    var channels = this.props.channels;
    var channelItems = channels.map((channel) =>
        <li key={channel.id}>{channel.name}</li>);
    var classes = classNames({
      "box": true,
      "Channels": true
    })

    return (
      <div className={classes}>
        <ul>
          {channelItems}
        </ul>
        <button onClick={this.promptChannelName}>New channel</button>
      </div>
    );
  }
}

export default Channels;