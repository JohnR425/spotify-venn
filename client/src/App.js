import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, InputGroup, FormControl, Button, Pagination} from 'react-bootstrap'
import {useState, useEffect} from 'react'
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-js'

function App() {
  //Spotify Web API JS
  const spotify = new SpotifyWebApi();
  
  //Account Authorization
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const scopes = [
  "playlist-read-private",
  "playlist-read-collaborative"
  ]
  
  //Setting up use states
  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])  
  const [spotifyToken, setSpotifyToken] = useState("")

  //Credit: https://github.com/dom-the-dev/spotify-with-react
  //
  useEffect(() => {
    //Getting access token from account authorization
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }

    setToken(token)

    //Authorizing with Spotify API via Spotify Web API JS
    if (token) {
      spotify.setAccessToken(token)
    }
}, [])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }
//

  const items = [...Array(33).keys()];

  function Items({ currentItems }) {
    return (
      <div className="items">
      {currentItems && currentItems.map((item) => (
        <div>
          <h3>Item #{item}</h3>
        </div>
      ))}
        </div>
    );
  }
  
  function PaginatedItems({ itemsPerPage }) {
    // We start with an empty list of items.
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);
  
    useEffect(() => {
      // Fetch items from another resources.
      const endOffset = itemOffset + itemsPerPage;
      console.log(`Loading items from ${itemOffset} to ${endOffset}`);
      setCurrentItems(items.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(items.length / itemsPerPage));
    }, [itemOffset, itemsPerPage]);
  
    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
      const newOffset = event.selected * itemsPerPage % items.length;
      console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
      setItemOffset(newOffset);
    };
  
    return (
      <>
        <Items currentItems={currentItems} />
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="< previous"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </>
    );
  }

  //Returns a spotify user's ID given their spotify link
  function GetUserID(profileLink) {
    const first_half = profileLink.split("user/")[1]
    const second_half = first_half.split("?si=")[0]

    return second_half
  }

  function GetUserPlaylists(user) {
    return user.length == 0? spotify.getUserPlaylists() : spotify.getUserPlaylists(user)
  }

  async function GetUserTracks(user) {
    const trackset = new Set()
    
    const user_playlists = await GetUserPlaylists(user)
    user_playlists.items.forEach(async playlist => {
      const id = playlist.id
      const searched_tracks = await spotify.getPlaylistTracks(id)
        const tracks = searched_tracks.items 
        tracks.forEach(track => {
            try {
              if(track.track.name === null) {
                throw track
              }
              else {
                //console.log(playlist.name, track.track.name)
                trackset.add(track.track.name)
              }
              
            }
            catch (error) {
              console.log("ERROR", track)
            }
          })
    });
    return trackset;
  }
  
  function GetIntersect(set_1, set_2) {
    let intersect = new Set();
    let counter = 0;

    console.log("SET", set_1)

    for (let key of set_1) {
      console.log("VAL", key)
      if(set_2.has(key)) {
        intersect.add(key)
      }
      counter++;
    }

    if(counter == set_1.size) {
      return intersect
    }
  }

  async function DoWork(user) {
    const searched_trackset = await GetUserTracks(user)
    const searcher_trackset = await GetUserTracks("")
    const intersect = await GetIntersect(searched_trackset, searcher_trackset)

    console.log("SEARCHED:", searched_trackset)
    console.log("SEARCHER:", searcher_trackset)
    console.log("INTERSECT:", intersect)
    return intersect
  }

  function GetCommonTracks (profile_link) {
    const searched_id = GetUserID(profile_link)
    let intersect = DoWork(searched_id)
  }

  return (
    <div className="App">
      <Container>
        <header className="App-header">
          <h1>Spotify Venn</h1>
                  {!token ?
                      <a href={`${AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&show_dialog=true`}>Login
                      to Spotify</a>
                  : <button onClick={logout}>Logout</button>}

                  {token ?
                      <InputGroup className="mb-3" size="lg">
                      <FormControl
                        placeholder = "[DISABLED FOR TESTING] Search for User (Enter User Profile Link)"
                        type = "input"
                        onKeyDown={(Event) => {
                          if (Event.key == "Enter") {
                            //For TESTING ONLY
                            const enter_link = "https://open.spotify.com/user/ug6t4y22d08z44s9kzl62hptj?si=093d80d60aa5444a"
                            let intersect = new Set();
                            GetCommonTracks(enter_link);
                          }
                        }}
                        //onChange={(Event) => setSearchInput(Event.target.value)}
                      />
                      <Button>
                        Search
                      </Button>
                    </InputGroup>

                      : <h2>Please login</h2>
                  }
        </header>
      </Container>
      {/* <Container>
        <div class = "pagination">

          <PaginatedItems itemsPerPage={4} class="pagination-centered" className="mb-3" size="lg"/>
        </div>
      </Container> */}
    </div>
  );
}

export default App;
