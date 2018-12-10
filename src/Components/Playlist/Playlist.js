import React, { Component } from 'react';
import TrackList from '../TrackList/TrackList';

import './Playlist.css';

class Playlist extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="Playlist">
            <input defaultValue="New Playlist" onChange={this.props.onNameChange} />
            <TrackList tracks={this.props.playListTracks} onRemove={this.props.onRemove} isRemoval={true} />
            <a className="Playlist-save" onClick={this.props.onSave} >SAVE TO SPOTIFY</a>
        </div>
    );
  }
}

export default Playlist;