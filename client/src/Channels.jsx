import React, { Component } from 'react';
import ChannelControls from './ChannelControls.jsx'

class Channels extends Component {
  constructor(props) {
    super(props);
    this.selectChannel = this.selectChannel.bind(this);
  }

  selectChannel(channel) {
    this.props.onChannelSelect(channel);
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

    return (
      <div className="Channels">
        <h3>Channels</h3>
        <ul>
          {channelItems}
        </ul>
        <ChannelControls
          myChannels={this.props.myChannels}
          allChannels={this.props.allChannels}
          onChannelSelect={this.props.onChannelSelect}
          onChannelAdd={this.props.onChannelAdd}
          onChannelJoin={this.props.onChannelJoin}/>
      </div>
    );
  }
}

export default Channels;