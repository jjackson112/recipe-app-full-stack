import React from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import "./App.css";
import RecipeExcerpt from "./components/RecipeExcerpt.js";
import RecipeFull from "./components/RecipeFull.js"
import NewRecipeForm from "./components/NewRecipeForm.js";

/* async request to /api/recipes endpoint to grab all recipes and update state, handle errors, and make sure response is ok*/

function App() {
  const [recipes, setRecipes] = useState([])
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false)
  // there is no id attribute since the database assigns one by default for each form submission
  const [newRecipe, setNewRecipe] = useState(
    {
      title: "",
      ingredients: "",
      instructions: "",
      servings: 1, // conservative default
      description: "",
      image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
    }
  )

  useEffect( () => {
    const fetchAllRecipes = async () => {
      try {
        const response = await fetch("/api/recipes");
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
        } else {
          console.log(`Cannot find that recipe!`);
        }
      } catch (e) {
        console.error(`An error occurred during the request.`, e)
      }
    };
    fetchAllRecipes();
  }, [])

  /* Update the status of the selectedRecipe state */
    const handleSelectRecipe = (recipe) => {
      setSelectedRecipe(recipe);
    }

  /* Allows you to unselect a recipe */
    const handleUnselectRecipe = () => {
      setSelectedRecipe(null);
    };

  /* Show state of a new submitted recipe */
  /* Set selectedRecipe back to null so you can show the recipe form OR the selected recipe */
  const showRecipeForm = () => {
    showNewRecipeForm(true)
    selectedRecipe(null)
  }

  /* Hide state of a new submitted recipe */
  const hideRecipeForm = () => {
    showNewRecipeForm(false)
  }

  /* replace {JSON.stringify(recipes)} with a map over all recipes in state*/
  /* each recipe has an ID for the key and a prop for each recipe*/
  return (
    <div className='recipe-app'>
      <Header showRecipeForm={showRecipeForm}/>
      {showNewRecipeForm && (
        <NewRecipeForm newRecipe={newRecipe} hideRecipeForm={hideRecipeForm}/>
      )}
      {selectedRecipe && (
        <RecipeFull selectedRecipe={selectedRecipe} handleUnselectRecipe={handleUnselectRecipe}/>
      )}
      {selectedRecipe && (
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <RecipeExcerpt key={recipe.id} recipe={recipe} handleSelectRecipe={handleSelectRecipe} />
        ))}
      </div>
      )}
    </div>
  );
}

export default App;
