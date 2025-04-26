import React from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import "./App.css";

/* async request to /api/recipes endpoint to grab all recipes and update state, handle errors, and make sure response is ok*/

function App() {
  const [recipes, setRecipes] = useState([])

  useEffect( () => {
    const fetchAllRecipes = async () => {
      try {
        const response = await fetch('/api/recipes')
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
        } else {
          console.log(`Cannot find that recipe!`);
        }
      } catch (e) {
        console.log(`An error has occurred. Please try again.`)
      }
    };
    fetchAllRecipes();
  }, [])

  return (
    <div className='recipe-app'>
      <Header />
      {JSON.stringify(recipes)}
    </div>
  );
}

export default App;
