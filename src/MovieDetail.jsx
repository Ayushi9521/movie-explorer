import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_KEY = "dbfc7b56d9f6aa90199e0ec1a5a18d5a";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch movie details.");
        }
        const result = await response.json();
        setMovie(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-danger text-center">{error}</p>;
  }
  return (
    <div className="container mt-5">
      <Link to="/" className="btn btn-primary mb-3">
        ← Back to Home
      </Link>
      <div className="row">
        <div className="col-md-4">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/500x750"
            }
            alt={movie.title}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-8">
          <h1 className="mb-3">{movie.title}</h1>
          <p>
            <strong>Tagline:</strong> {movie.tagline || "N/A"}
          </p>
          <p>
            <strong>Overview:</strong>{" "}
            {movie.overview || "No overview available."}
          </p>
          <p>
            <strong>Release Date:</strong> {movie.release_date || "N/A"}
          </p>
          <p>
            <strong>Runtime:</strong>{" "}
            {movie.runtime ? `${movie.runtime} mins` : "N/A"}
          </p>
          <p>
            <strong>Rating:</strong>{" "}
            {movie.vote_average ? `${movie.vote_average} / 10` : "N/A"} (
            {movie.vote_count || 0} votes)
          </p>
          <p>
            <strong>Genres:</strong>{" "}
            {movie.genres?.length > 0
              ? movie.genres.map((genre) => genre.name).join(", ")
              : "N/A"}
          </p>
          <p>
            <strong>Production Companies:</strong>{" "}
            {movie.production_companies?.length > 0
              ? movie.production_companies
                  .map((company) => company.name)
                  .join(", ")
              : "N/A"}
          </p>
          <p>
            <strong>Budget:</strong>{" "}
            {movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"}
          </p>
          <p>
            <strong>Revenue:</strong>{" "}
            {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
