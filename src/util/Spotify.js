// const client_secret = '2c843e2841f24a76b5341866921e17aa'; // Insert API key here.
let accessToken = '';
let expires_in ='';
// Get acces token
const client_id = 'c2d83c6e057148039ea95763bdd00bd2';
const redirect_uri = 'http:%2F%2Flocalhost:3000';

const Spotify = {

  getAccessToken() {
    console.log(`getAccessToken: ${accessToken}`);
    console.log(`url: ${window.location.href.match('access_token=([^&]*)')}`);
    if ( accessToken === '' ) {
        if(!window.location.href.match('access_token=([^&]*)')) {
          console.log(`get`);
          window.location.assign(`https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=token&scope=playlist-modify-public`);
          return '';
        } else {
          //TODO: read accessToken from uri call
          console.log(`read`);
          accessToken = window.location.href.match('access_token=([^&]*)').toString();
          expires_in = window.location.href.match('expires_in=([^&]*)').toString().substring(accessToken.indexOf('=')+1);
          
          accessToken = accessToken.substring(accessToken.indexOf('=')+1);
          expires_in = expires_in.substring(accessToken.indexOf('=')+1);
          
          console.log(`accessToken: ${accessToken}`);
          console.log(`expires_in: ${expires_in}`); 
          // timer to clear access token 
          this.setTimeout(() => {
            console.log('I do not leak!');
          }, expires_in);
          accessToken = '';
          expires_in = '';
          return accessToken;
          
        }
    } else {
        console.log(`read: ${accessToken}`);
        return accessToken;
    }
  },


  search(term){
      console.log(`search${term}`);
      fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if (jsonResponse.tracks) {
          console.log(`sonResponse.items: ${JSON.stringify(jsonResponse.tracks.items)}`);
          jsonResponse.tracks.items.map(track => (console.log('eeeee'+ JSON.stringify(track.name))));
          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }));
        } else {
          return [];
        }
      });
  },

  savePlaylist(name, uris) {
    if(name !== '' && uris !== []) {
      return;
    } 

    let accessToken = this.accessToken;
    let headers = { Authorization: `Bearer ${this.getAccessToken()}`};
    let clientId = '';

    fetch('https://api.spotify.com/v1/me', {headers: headers }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.id) {
        clientId = jsonResponse.id
      }
    });

    
    //TODO: post call
    // const urlToShorten = inputField.value;
    // const data = JSON.stringify({destination: urlToShorten});
    // try {
    //   const response = await fetch(url, {
    //     method: 'POST',
    //     body: data,
    //     headers: {
    //       'Content-type': 'application/json',
    //       'apikey': apiKey
    //     }
    //   });
    //   if(response.ok){
    //     const jsonResponse = await response.json();
    //     renderResponse(jsonResponse);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  }

};

export default Spotify; 