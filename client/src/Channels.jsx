import React, { Component } from 'react';
import classNames from 'classnames';

class Channels extends Component {
  render() {
    var channels = this.props.channels;
    var channelItems = channels.map((channel) =>
        <li key={channel.id}>{channel.name}</li>);
    var classes = classNames({
      "box": true,
      "Channels": true
    })

    return (
      <ul className={classes}>
        {channelItems}
      </ul>
    );
  }
}

export default Channels;