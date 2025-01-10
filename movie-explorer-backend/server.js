import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.TMDB_API_KEY;

app.use(cors());
app.use(express.json());

// Define the API route for fetching movies
app.get("/api/movies", async (req, res) => {
  const { query, page, genre, year } = req.query;

  try {
    const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${page}&with_genres=${genre}&primary_release_year=${year}`;
    const response = await fetch(tmdbUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Define the API route for fetching genres
app.get("/api/genres", async (req, res) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch genres" });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
