import "./styles.css";
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";
import { useQuery } from "@tanstack/react-query";
import SwipeableItem from "./SwipeableItem";

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQTTTcR_N0xxNKoBRgTJPmvWGvLTrpUkadrTpK0A3W_aqRzqIpr_o7NHTDZjmHJk7R-A2l63OBC9xnP/pub?output=csv";

const dogGifArr = [
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTJwc3h1NGdjNGR6ZG8wemxxMW90ZWN0cGlnZDlsZW41M2VwNDN2eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Fu3OjBQiCs3s0ZuLY3/giphy.gif",
  "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmp2MnM2MTh6MnE5cGJuODlzajgwYmRoejkyN2dmdzkzeGk3cHhiaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/k2Da0Uzaxo9xe/giphy.gif",
  "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjI3dmJxNDB2ZjJiaXRrcjJmMHlrOTIxZGRxYTZqaGdleWZheTg2ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QvBoMEcQ7DQXK/giphy.gif",
  "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ29mc2VzYWQ0emNoOWlqMW4zZmxldDZ6OGF3ZXIxMGRmOW1sM3ZhNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9gn4lhW6wiQ6c/giphy.gif",
  "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDNnYTVsYjcwbDJ6YjExcHpoc3N6aXpoZDNiZGhkeWl2MmhrdGEzbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ornk2v68yO67m4Le0/giphy.gif",
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHp6aWZwYTYyYWRqYjFwM2MyOTlwYzMwN2xqeDl6d3o4Z2NtNjFlNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/q9ETKoMaBMsNy/giphy.gif",
  "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExemk4eGE3cmg5eWxxcDFtMHBqZjYybXQxM21paDl4OGdybjRqbXpyYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/EPkb6xoNOR1Sg/giphy.gif",
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExanJuZm90b3R2eWVjdWJ6NGprMnpiemUyNWd4a3o1OGc3ZmF2cmlzdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yNvPaHz8LI4I4jKKws/giphy.gif",
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExanlnbTRtdXRuOHB0bW9jbGhvNmNwMWt0OHl0NDY5ZWIzOXFjMzUzZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fHr2GbZEWLqNNXgmOF/giphy.gif",
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWx3anBrbWVuNmI1ajB3YjhkdjNpYXZ6am90M3BnOGo0Y2tzcTV4NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/oH9DJbJJr42lO/giphy.gif",
  "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWszOWQ5a3FlMGl6djQ1amx6aXBkN2VjdXptazg5NXhsNmlhZDRmZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/P7hIImx7r1sas/giphy.gif",
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGlzbGlpeWdlZXpxMTloNThpenFxcTFmMnBjanJjdzhub3FqN2FhaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZZAyXQIewUut2/giphy.gif",
];

// Fisher-Yates shuffle
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const fetchTricks = async () => {
  const res = await fetch(SHEET_CSV_URL);
  const csv = await res.text();
  return new Promise((resolve) => {
    Papa.parse(csv, {
      header: true,
      complete: (results) => {
        // Ensure each item has a unique id (fallback to index)
        const data = results.data
          .filter((row) => row && Object.keys(row).length > 0)
          .map((row, idx) => ({
            ...row,
            id: row.id || row.ID || row.Id || idx.toString(),
          }));
        resolve(shuffleArray(data));
      },
    });
  });
};

const App = () => {
  const { data: tricks, isLoading, isError, refetch } = useQuery({
    queryKey: ["tricks"],
    queryFn: fetchTricks,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const [items, setItems] = useState(null);
  const [dogGif, setDogGif] = useState(() => shuffleArray(dogGifArr)[0]);

  // Set items when tricks are loaded
  useEffect(() => {
    if (tricks) setItems(tricks);
  }, [tricks]);

  // Preload dog gif
  useEffect(() => {
    if (dogGif) {
      const img = new window.Image();
      img.src = dogGif;
    }
  }, [dogGif]);

  // Remove item by id
  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Shuffle tricks and dog gif
  const refreshShuffle = () => {
    if (!tricks) return;
    setDogGif(shuffleArray(dogGifArr)[0]);
    setItems(shuffleArray(tricks));
  };

  if (isLoading || items === null) {
    return (
      <div className="appHolder">
        <Header/>
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="appHolder">
        <Header/>
        <p>
          Error loading tricks.{" "}
          <button onClick={refetch}>Retry</button>
        </p>
      </div>
    );
  }

  return (
    <div className="appHolder">
      <Header/>
      <p className="Instructions">
        Swipe right on any trick if completed <b>👉</b>
      </p>
      <ul>
        <AnimatePresence>
          {items.map((item) => (
            <SwipeableItem
              key={item.id}
              item={item}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </AnimatePresence>
      </ul>
      {items.length === 0 && (
        <div className="GoodBoy">
          <div>
            <h2>Good Boy!</h2>
            <p>You Deserve a treat!</p>
            <img src={dogGif} alt="happy dog gif" />
            <button onClick={refreshShuffle}>Refresh & Shuffle</button>
          </div>
        </div>
      )}
      {items.length > 0 && (
        <button onClick={refreshShuffle}>Refresh & Shuffle</button>
      )}
      <img src="./Dog.svg" alt="My Dog Fibbie" className="Fibbie" />
    </div>
  );
};

const Header = () => (
  <header className="App-header">
    <img src="./Logo.svg" className="App-logo" alt="logo" />
    <h1>Divine Doggie Drills</h1>
  </header>
);

export default App;
