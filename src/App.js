import React from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull"
import NewRecipeForm from "./components/NewRecipeForm";
import "./App.css";

/* async request to /api/recipes endpoint to grab all recipes and update state, handle errors, and make sure response is ok*/

function App() {
  const [recipes, setRecipes] = useState([])
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false)
  
  // there is no id attribute since the database assigns one by default for each form submission
  const [newRecipe, setNewRecipe] = useState({
      title: "",
      ingredients: "",
      instructions: "",
      servings: 1, // conservative default
      description: "",
      image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
    })

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
}

  /* accepts e and newRecipe as arguments */
  /* e prevent default is used to submit the form */
  /* send over newRecipe data as JSON to the API endpoint 
  JSON > python dictionary - new database record
  API sends back saved recipe as JSON to the front end with a new ID in database */
  /* data.recipe is our recipe  */
  const handleNewRecipe = async (e, newRecipe) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(newRecipe)
      });

      if (response.ok) {
        const data = await response.json();

        setRecipes = ([...recipes, data.recipe]);

        console.log("Recipe added successfully!")

        // this is happening once the user completes the form and saves it - with this the form goes away
        setShowNewRecipeForm(false)
        setNewRecipe({
          title: "",
          ingredients: "",
          instructions: "",
          servings: 1, // conservative default
          description: "",
          image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
        });
      } else {
        console.error("Oops could not add recipe.")
      }
    } catch (e) {
      console.error(`An error has occurred - this recipe cannot be added.`)
    }
  };

  /* handleUpdateRecipe function is similar to handleNewRecipe */
  /* except update an existing recipe */

  const handleUpdateRecipe = async (e, selectedRecipe) => {
    e.preventDefault();
  // you need the id to make sure the PST request reaches the correct endpoint
    const {id} = selectedRecipe;

    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(selectedRecipe)
      });

      if (response.ok) {
      const data = await response.json();

  // setRecipes changes - you map over existing recipes in state
  // if recipes have the same id as selectedRecipes, the recipe object inside the data received as a response from data.recipe is returned
        setRecipes(
          recipes.map ((recipe) => {
            if (recipe.id === id) {
              return data.recipe
            } 
            return recipe
          })
        )
        console.log("Recipe has been edited successfully!")
      } else {
        console.error("Oops! We cannot fetch the recipe!")
      }
    } catch (error) {
        console.error("An error has errored - you cannot edit or update this recipe.", e)
    }
    setSelectedRecipe(null);
  }

  // Delete a recipe - no need for headers or body
  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`/api/recipes/${selectedRecipe.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setRecipes(recipes.filter((recipe) => recipe.id !== recipeId))
        setSelectedRecipe(null) // see recipe excerpts view once more
        console.log("Recipe successfully deleted!")
      } else {
        console.error("Oops! This recipe cannot be deleted!")
      }
    } catch (error) {
      console.error(`An error has occurred, this recipe cannot be deleted!`)
  }

  /* Update the status of the selectedRecipe state */
  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  /* Allows you to unselect a recipe */
  const handleUnselectRecipe = () => {
    setSelectedRecipe(null);
  };

  /* Show state of a new submitted recipe */
  /* Set selectedRecipe back to null so you can show the recipe form OR the selected recipe */
  const showRecipeForm = () => {
    setShowNewRecipeForm(true)
    setSelectedRecipe(null)
  };

  /* Hide state of a new submitted recipe */
  const hideRecipeForm = () => {
    setShowNewRecipeForm(false)
  };

  /* Update newRecipe state - USER INPUT */
  /* name attribute is important - allows us to know which form attribute we're working with */
  /* destructured name and value properties from e.target */
  /* pass an object to setNewRecipe to updater function */
  /* change [name] with input value - [] because it will accept a dynamic value (e.target.value) */
  /* action="new" is the action parameter with the default value of new - in case the paramenter provided isn't provided to the parameter when it's called (can be update too) */
  /* if the action is update, update the selectedRecipe*/
  /* if the action is new, update the newRecipe*/

  const onUpdateForm = (e, action="new") => {
    const { name, value } = e.target;
      if (action === "update") {
        //update recipe
        setSelectedRecipe({...selectedRecipe, [name]: value})
      } else if (action === "new") {
        // update new recipe state - same line as before
        setNewRecipe({...newRecipe, [name]: value })
      }
  };

  /* replace {JSON.stringify(recipes)} with a map over all recipes in state*/
  /* each recipe has an ID for the key and a prop for each recipe*/
  return (
    <div className='recipe-app'>
      <Header showRecipeForm={showRecipeForm}/>
      {showNewRecipeForm && (
        <NewRecipeForm newRecipe={newRecipe} hideRecipeForm={hideRecipeForm} onUpdateForm={onUpdateForm} handleNewRecipe={handleNewRecipe}/>
      )}
      {selectedRecipe && 
        <RecipeFull selectedRecipe={selectedRecipe} handleUnselectRecipe={handleUnselectRecipe} onUpdateForm={onUpdateForm} handleUpdateRecipe={handleUpdateRecipe} handleDeleteRecipe={handleDeleteRecipe}/>
      }
      {!selectedRecipe && !showNewRecipeForm && (
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