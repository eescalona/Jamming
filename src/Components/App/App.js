import React, { Component } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import './App.css';

class App extends Component {
  constructor(props) {
      super(props);

      this.state = {
        searchResults: [],
        playListName: 'New Playlist',
        playListTracks: []
      };

      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.handlePlayListNameChange = this.handlePlayListNameChange.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.searchSpotify = this.searchSpotify.bind(this);
  }

  searchSpotify(term) {
    Spotify.search(term).then(list => {
      this.setState({searchResults: list});
    });
    
    // this.setState.searchResults.map(tr => {console.log(JSON.stringify(tr))});
  }

  handlePlayListNameChange(event) {
    this.setState({playListName: event.target.value});
  }

  addTrack(track) {
    if (this.state.playListTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }

    this.setState(({
      playListTracks: [...this.state.playListTracks, track]
    }));
  }

  removeTrack(track) {
    console.log(`playListTracks:${this.state.playListTracks.length}`);
      this.setState({
        playListTracks: this.state.playListTracks.filter(savedTrack => savedTrack.id !== track.id)
      });
  }

  savePlaylist() {
    console.log(`playListTracks:${this.state.playListTracks.length}`);
    this.state.playListTracks.map(track => console.log(JSON.stringify(track)));

    const trackURIs = this.state.playListTracks.map(savedTrack => savedTrack.uri);
    console.log(`trackURIs${trackURIs}`);

    //TODO: check if succes
    Spotify.savePlaylist(this.state.playListName, trackURIs);
    this.setState({playListName: '', playListTracks: [] });

  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.searchSpotify} /> 
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} /> 
            <Playlist playListName={this.state.playListName} playListTracks={this.state.playListTracks} 
            onRemove={this.removeTrack} onNameChange={this.handlePlayListNameChange} onSave={this.savePlaylist}/> 
          </div>
        </div>
      </div>
    );
  }
}

export default App;
