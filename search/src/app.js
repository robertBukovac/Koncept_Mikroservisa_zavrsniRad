const fetch = require("node-fetch");
const express = require("express");
const Video = require("./models/video_model");
const Book = require("./models/books_model");
const app = express();

app.get("/", (req, res) => {
  res.json({ msg: "search" });
});


app.get("/api/v1/search", async (req, res) => {
    // ne želimo await radit jer želimo oba requesta u isto vrijeme 
    const videosPromise = Video.find({});
  const booksPromise = Book.find({});
  const promises = [videosPromise, booksPromise];
  const [videos, books] = await Promise.all(promises);

  res.json(videos.concat(books));
});

app.get("/api/v1/search/depends-on", async (req, res) => {
  try {
    // ne želimo await radit jer želimo oba requesta u isto vrijeme 
    const videoPromise = fetch("http://videos:3000/");
    const bookPromise = fetch("http://books:3000/");
    const promises = [videoPromise, bookPromise];
    const [videoResponse, bookResponse] = await Promise.all(promises);
    const videoJson = await videoResponse.json();
    const bookJson = await bookResponse.json();

    res.json({ video: videoJson, book: bookJson });
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = app;
