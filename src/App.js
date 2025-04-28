import React from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import "./App.css";
import RecipeExcerpt from "./components/RecipeExcerpt";"./components/RecipeExcerpt"

/* async request to /api/recipes endpoint to grab all recipes and update state, handle errors, and make sure response is ok*/

function App() {
  const [recipes, setRecipes] = useState([])

  useEffect( () => {
    const fetchAllRecipes = async () => {
      try {
        const response = await fetch("/api/recipes")
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
        } else {
          console.log(`Cannot find that recipe!`);
        }
      } catch (e) {
        console.error(`An error occurred during the request.`, e)
        console.log(`An error has occurred. Please try again.`)
      }
    };
    fetchAllRecipes();
  }, [])

  /* replace {JSON.stringify(recipes)} with a map over all recipes in state*/
  /* each recipe has an ID for the key and a prop for each recipe*/
  return (
    <div className='recipe-app'>
      <Header />
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <RecipeExcerpt key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default App;
