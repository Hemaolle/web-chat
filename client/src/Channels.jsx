import React, { Component } from 'react';
import classNames from 'classnames';
import Popup from 'react-popup';

class Channels extends Component {
  constructor(props) {
    super(props);
    this.promptChannelName = this.promptChannelName.bind(this);
    this.selectChannel = this.selectChannel.bind(this);
    this.promptChannelToJoin = this.promptChannelToJoin.bind(this);
  }

  promptChannelName() {
    Popup.plugins().prompt('Name the new channel', '', 'Type the channel name', function (value) {
      this.props.onChannelAdd({name: value});
    }.bind(this));
  }

  selectChannel(channel) {
    this.props.onChannelSelect(channel)
  }

  promptChannelToJoin() {
    var options = this.props.allChannels.map((channel) =>
      ({ value: channel.id, label: channel.name }));
    Popup.plugins().select('Select a channel to join', options,
      (channelId) => this.props.onChannelJoin)
  }

  render() {
    var channels = this.props.myChannels;
    var channelItems = channels.map((channel) =>
        <li key={channel.id}>
          {channel === this.props.currentChannel ?
          (channel.name)
          : (<button onClick={() => this.selectChannel(channel)}>{channel.name}</button>)}
        </li>);
    var classes = classNames({
      "box": true,
      "Channels": true
    })

    return (
      <div className={classes}>
        <h3>Channels</h3>
        <ul>
          {channelItems}
        </ul>
        <button onClick={this.promptChannelToJoin}>Join channel</button>
        <button onClick={this.promptChannelName}>New channel</button>
      </div>
    );
  }
}

export default Channels;