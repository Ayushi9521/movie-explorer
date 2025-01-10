import { useState } from "react";
import "./App.css";
import useFetch from "./customeHooks/useFetch";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [genresList, setGenresList] = useState([]);

  const { data, error, loading } = useFetch(query, page, genre, year);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGeners = async () => {
      const response = await fetch("http://localhost:3001/api/genres");
      const result = await response.json();
      setGenresList(result.genres);
    };
    fetchGeners();
  });

  const handleCardClick = (id) => {
    navigate(`/movie/${id}`);
  };

  return (
    <>
      <div className="container mt-5">
        <h1 className="text-center">Movie Explorer</h1>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1); // Reset page on new search
          }}
        />
        {/* show if Loading */}
        {loading && page === 1 && (
          <div className="d-flex justify-content-center my-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="d-flex gap-3 mb-4">
          {/* Genre Filter */}
          <select
            className="form-select"
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Genres</option>
            {genresList.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          {/* Release Year Filter */}
          <input
            type="number"
            className="form-control"
            placeholder="Release Year"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Display errors if any */}
        {error && <p className="text-danger">{error}</p>}

        {/* display movie cards */}
        <div className="row">
          {data?.map((movie) => {
            return (
              <div
                className="col-md-3 mb-4"
                key={movie.id}
                onClick={() => handleCardClick(movie.id)}
              >
                <div className="card">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/500x750"
                    }
                    className="card-img-top"
                    alt={movie.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
                    <p className="card-text">
                      {movie.overview.length > 100
                        ? `${movie.overview.substring(0, 100)}...`
                        : movie.overview}
                    </p>
                    <p className="card-text">
                      <small className="text-muted">
                        Release Date: {movie.release_date || "N/A"}
                      </small>
                    </p>
                    <p className="card-text">
                      <small className="text-warning">
                        Rating:{" "}
                        {movie.vote_average ? movie.vote_average : "N/A"} / 10
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Pagination Buttons */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            className="btn btn-primary"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            className="btn btn-primary"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={data && data.page >= data.total_pages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
