import React, { Component } from 'react';
import Popup from 'react-popup';

class Channels extends Component {
  constructor(props) {
    super(props);
    this.promptChannelName = this.promptChannelName.bind(this);
    this.selectChannel = this.selectChannel.bind(this);
    this.promptChannelToJoin = this.promptChannelToJoin.bind(this);
    this.memberIn = this.memberIn.bind(this);
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
    var availableChannels = this.props.allChannels.filter(
      (channel) => !this.memberIn(channel));
    var options = availableChannels.map((channel) =>
      ({ value: channel.id, label: channel.name }));

    if (availableChannels.length === 0) {
      Popup.alert('You\'ve already joined all the channels.');
      return;
    }
    
    Popup.plugins().select('Select a channel to join', options,
      (channelId) => this.props.onChannelJoin(channelId));
  }

  memberIn(channel) {
    return this.props.myChannels.some(myChannel => myChannel.id === channel.id);
  }

  render() {
    var channels = this.props.myChannels;
    var channelItems = null;
    if (channels)
    {
      channelItems = channels.map((channel) =>
        <li key={channel.id}>
          {this.props.currentChannel && channel.id === this.props.currentChannel.id ?
          (channel.name)
          : (<button onClick={() => this.selectChannel(channel)}>{channel.name}</button>)}
        </li>);
    }

    // Don't show the button unless we have the required list of channels.
    var joinChannelButton = null;
    if (this.props.allChannels)
    { 
      joinChannelButton = 
        (<button onClick={this.promptChannelToJoin}>Join channel</button>);
    }

    return (
      <div className="Channels">
        <h3>Channels</h3>
        <ul>
          {channelItems}
        </ul>
        {joinChannelButton}
        <button onClick={this.promptChannelName}>New channel</button>
      </div>
    );
  }
}

export default Channels;