import React, { Component } from 'react';

class Channels extends Component {
  render() {
    var channels = this.props.channels;
    var channelItems = channels.map((channel) =>
        <li>{channel.name}</li>);

    return (
      <ul className="Channels">
        {channelItems}
      </ul>
    );
  }
}

export default Channels;