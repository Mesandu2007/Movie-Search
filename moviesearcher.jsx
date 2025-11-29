import React,{useState,useEffect} from  "react";
import "./movie1.css"
const API_KEY="c985fa68";
const DEFAULT_QUERY="Avengers";

export default function MovieSearchApp(){
  const[query,setQuery]=useState("");
  const[movies,setMovies]=useState([]);
  const[selectedMovie,setSelectedMovie]=useState(null);
  const[favorites,setFavourites]=useState([]);

  useEffect(()=>{
    const loadDefaultMovies=async()=>{
      const response=await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${DEFAULT_QUERY}`

      );
      const data=await response.json();
      if(data.Search){
        setMovies(data.Search);
      }
    };
    loadDefaultMovies();

  },[]); //empty dependency array = runs once on page load

  const searchMovies=async()=>{
    if(! query){
      alert("Pls Enter A Movie Name!");
      return;
    };
    const response=await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`
      
    );
    const data=await response.json();
    setMovies(data.Search || []);
    
  };
  // Fetch movie detailes
  const fetchMovieDetailes=async (id)=>{
    const response=await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`

    );
    const data=await response.json();
    setSelectedMovie(data);

  };
  useEffect(()=>{
    const savedFavs=localStorage.getItem("favoriteMovies");
    if(savedFavs){
      setFavourites(JSON.parse(savedFavs));
    }
  },[]);
  const addToFavorites=(movie)=>{
    const alreadyExists=favorites.some(fav=> fav.imdbID===movie.imdbID);
    if(alreadyExists){
      alert("Movie is already in favourites!");
      return;
    }
    const updatedFavs=[...favorites,movie];
    setFavourites(updatedFavs);
    localStorage.setItem("favoriteMovies",JSON.stringify(updatedFavs));
    alert("Added to favourites!");
  };
  const removeFromFavorites=(id)=>{
    const updateFavs=favorites.filter(movie=>movie.imdbID !==id);
    setFavourites(updateFavs);
    localStorage.setItem("favoriteMovies", JSON.stringify(updateFavs));
  };
  const closeDetails=()=>setSelectedMovie(null);
  return(
    <div className="container">
      <h1>Movie Search</h1>
      <div className="search-bar">
        <input
        type="text"
        placeholder="Search Movies..."
        value={query}
        onChange={(e)=> setQuery(e.target.value)}
        />
        <button onClick={searchMovies}>Search</button>
      </div>
      <div className="movie-grid">
        {movies.map((movie) => (
          <div
            className="movie-card"
            key={movie.imdbID}
            onClick={() => fetchMovieDetailes(movie.imdbID)}
          >
            <img
              src={
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://via.placeholder.com/150"
              }
              alt={movie.Title}
            />
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
          </div>
        ))}
      </div>
      <h2>⭐ Favourite Movies</h2>
      <div className="movie-grid">
        {favorites.map(movie => (
           <div className="movie-card" key={movie.imdbID}
            onClick={() => fetchMovieDetailes(movie.imdbID)}>
              <img
                src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"}
                alt={movie.Title}
              />
              <h3>{movie.Title}</h3>
              <p>{movie.Year}</p>

              <button className="remove" onClick={() => removeFromFavorites(movie.imdbID)}>
                ❌ Remove
              </button>
            </div> 
      ))}





        
    </div>










      {selectedMovie && (
        <div className="popup-overlay" onClick={closeDetails}>
          <div className="popup-box" onClick={(e)=> e.stopPropagation()}>
            <img
              src={
                selectedMovie.Poster !=="N/A"
                 ? selectedMovie.Poster
                 : "https://via.placeholder.com/150"
                 
              }
              alt={selectedMovie.Title}
              />
              <h2>{selectedMovie.Title}</h2>
              <p><strong>Year:</strong> {selectedMovie.Year}</p>
              <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
              <p><strong>Runtime:</strong> {selectedMovie.Runtime}</p>
              <p><strong>IMDB Rating:</strong> ⭐ {selectedMovie.imdbRating}</p>
              <p><strong>Plot:</strong> {selectedMovie.Plot}</p>

              <div className="alignf">

                <button className="favbtn" onClick={()=>addToFavorites(selectedMovie)}>
                  Add to Favourites ❤️
                </button>

                <button onClick={closeDetails} className="close-btn">Close</button>
              </div>  

          </div>
        </div>  

      )}
      


    </div>
  );  

  
  
 





}