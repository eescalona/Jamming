// const client_secret = '2c843e2841f24a76b5341866921e17aa'; // Insert API key here.
let accessToken = '';
let expires_in ='';
let userId ='';

// Get acces token
const client_id = 'c2d83c6e057148039ea95763bdd00bd2';
const redirect_uri = 'http:%2F%2Flocalhost:3000';

const Spotify = {

  getAccessToken() {
    try{
      console.log(`getAccessToken: ${accessToken}`);
      if ( accessToken === '' ) {
        if(!window.location.href.match('access_token=([^&]*)')) {
          console.log(`accessToken get`);
          window.location.assign(`https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=token&scope=playlist-modify-public`);
        } else {
          console.log(`accessToken read`);
          const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
          const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
  
          accessToken = accessTokenMatch[1];
          const expiresIn = Number(expiresInMatch[1]);
          Number(expiresInMatch[1]);

          window.setTimeout(() => accessToken = '', expiresIn * 1000);
          window.history.pushState('Access Token', 'Jammming', '/');
          return accessToken;
        }
      } else {
          console.log(`accessToken read: ${accessToken}`);
          return accessToken;
      }
    } catch (error) {
      console.log('Spotify getAccessToken ' + error);
    }
  },

  search(term){
    try {
      console.log(`search params: term: ${term}`);
      return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if (jsonResponse.tracks) {
          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }));
        } 
      });
    } catch (error) {
      console.log('Spotify search ' + error);
      return [];
    }
  },

  savePlaylist(name, uris) {
    try {
      console.log(`savePlaylist params: name: ${name}, uris: ${uris}`);
      if(name === '' || uris === []) {
        return;
      } 

      let accessToken = this.accessToken;
      let headers = { Authorization: `Bearer ${this.getAccessToken()}`};
      let userId = '';

      fetch('https://api.spotify.com/v1/me', { headers: headers }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if (jsonResponse.id) {
          return userId = jsonResponse.id
        }
      }).then(userId => {
        this.createPlayList(userId, name, uris);
        
      });
    } catch (error) {
      console.log('Spotify savePlaylist ' + error);
      return false;
    }
  },

  createPlayList(userId, playListName, trackURIs) {
    try {
    console.log(`createPlayList params: name: ${playListName}, userId: ${userId}, uris: ${trackURIs}`);
    fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({name: playListName})
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
      }).then(jsonResponse => {
        if(jsonResponse.id) {
          if(jsonResponse.id !== '') {
            return this.addTracks(jsonResponse.id, trackURIs);
          }
        }
      });
    } catch (error) {
      console.log('Spotify createPlayList ' + error);
      return '';
    }
  },

  addTracks(playListId, trackURIs) {
    try {
      console.log(`addTracks params: playListId: ${playListId}, uris: ${trackURIs}`);
      fetch(`https://api.spotify.com/v1/playlists/${playListId}/tracks`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({uris: trackURIs})
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
      }).then(jsonResponse => {
          return true;
      });
    } catch (error) {
      console.log('Spotify addTracks ' + error);
      return false;
    }
  }

};

export default Spotify; 