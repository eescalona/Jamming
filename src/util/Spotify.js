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
          return '';
        } else {
          //TODO: read accessToken from uri call back
          console.log(`accessToken read`);
          accessToken = window.location.href.match('access_token=([^&]*)').toString();
          expires_in = window.location.href.match('expires_in=([^&]*)').toString().substring(accessToken.indexOf('=')+1);
          
          accessToken = accessToken.substring(accessToken.indexOf('=')+1);
          expires_in = expires_in.substring(accessToken.indexOf('=')+1);
          
          console.log(`accessToken: ${accessToken}`);
          console.log(`expires_in: ${expires_in}`); 
          window.history.pushState({},'Jamming','http://localhost:3000');
            
          // timer to clear access token 
          setTimeout(() => {
            console.log('I clean');
            accessToken = '';
            expires_in = '';
          }, Number(expires_in)*100000000000);
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
        
        console.log('user id ' + JSON.stringify(jsonResponse));
        if (jsonResponse.id) {
          return userId = jsonResponse.id
        }
      });
    } catch (error) {
      console.log('Spotify savePlaylist ' + error);
      return false;
    }
  },

  createPlayList(userId, name) {
    try {
    console.log(`createPlayList params: name: ${name}, userId: ${userId}`);
    //TODO: post call
    // const data = JSON.stringify({destination: urlToShorten});
    // const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    //     method: 'POST',
    //     body: data,
    //     headers: {
    //       'Content-type': 'application/json',
    //       'apikey': apiKey
    //     }
    // });
    // if(response.ok){
    //     const jsonResponse = await response.json();
    //     renderResponse(jsonResponse);
    // }
      return true;
    } catch (error) {
      console.log('Spotify createPlayList ' + error);
      return '';
    }
  },

  addTracks(playListId, uris) {
    try {
      console.log(`createPlayList params: playListId: ${playListId}, uris: ${uris}`);
    //TODO: post call
    // const data = JSON.stringify({destination: urlToShorten});
    // const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    //     method: 'POST',
    //     body: data,
    //     headers: {
    //       'Content-type': 'application/json',
    //       'apikey': apiKey
    //     }
    // });
    // if(response.ok){
    //     const jsonResponse = await response.json();
    //     renderResponse(jsonResponse);
    // }
      return true;
    } catch (error) {
      console.log('Spotify addTracks ' + error);
      return false;
    }
  }

};



export default Spotify; 