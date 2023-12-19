import { useState, useEffect } from "react";
import "../App.css";
import MovieTable from "./MovieTable";
import { helperFunctions } from "../helpers/functions";
import AdminMovieTable from "./AdminMovieTable";
import EditMovieForm from "./EditMovieForm";

// const url = "https://the-maze-backend-jxbccvuzla-lz.a.run.app/movies";
// const url = "http://localhost:8080/movies";

function AdminPage({ logout, incrementPageViews }) {
  const [movies, setMovies] = useState([]);
  const [showEditMovie, setShowEditMovie] = useState(false);
  const [movieProperties, setMovieProperties] = useState({});

  useEffect(() => {
    const getMovies = async () => {
      const moviesFromDb = await helperFunctions.fetchMovies();
      setMovies(moviesFromDb);
    };

    getMovies();
  }, []);

  useEffect(() => {
    incrementPageViews();
  }, []);

  const toggleForm = (id, title, imdb, image, rating, count) => {
    const movie = { id, title, imdb, image, rating, count };
    setMovieProperties(movie);
    setShowEditMovie(!showEditMovie);
  };

  // Edit movie.
  const editMovie = async (movie) => {
    const res = await helperFunctions.editMovie(movie);

    console.log("RESULT: ", res);

    if (typeof res !== "string") {
      alert(`Something went wrong: ${res.error}`);
      return;
    }

    if (typeof res === "string") {
      if (!res.includes("success")) {
        logout();
        alert("Your session expired. Please log in again");
        return;
      }
    }

    setTimeout(async () => {
      const movies = await helperFunctions.fetchMovies();
      setMovies(movies);
    }, 300);

    return res;
  };

  // Update the rating of a movie
  const rateMovie = async (id, rating) => {
    const data = {
      id: id,
      rating: rating,
    };

    await helperFunctions.rateMovie(data);

    setTimeout(async () => {
      const movies = await helperFunctions.fetchMovies();
      setMovies(movies);
    }, 300);
  };

  const deleteMovie = async (id) => {
    const res = await helperFunctions.deleteMovie(id);

    if (typeof res !== "string") {
      alert(`Something went wrong: ${res.error}`);
      return;
    }

    if (typeof res === "string") {
      if (!res.includes("success")) {
        logout();
        alert("Your session expired. Please log in again");
        return;
      }
    }

    setTimeout(async () => {
      const movies = await helperFunctions.fetchMovies();
      setMovies(movies);
    }, 300);
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Admin</h1>
        <AdminMovieTable
          movies={movies}
          onUpdate={rateMovie}
          onDelete={deleteMovie}
          toggleForm={toggleForm}
        />
        {showEditMovie && (
          <EditMovieForm
            onEdit={editMovie}
            toggleForm={toggleForm}
            movieProps={movieProperties}
          />
        )}
      </div>
    </div>
  );
}

export default AdminPage;
