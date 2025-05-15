import React from "react";
import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt";
import RecipeFull from "./components/RecipeFull"
import NewRecipeForm from "./components/NewRecipeForm";
import displayToast from "./helpers/toastHelper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

/* async request to /api/recipes endpoint to grab all recipes and update state, handle errors, and make sure response is ok*/

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [favoriteRecipe, setFavoriteRecipe] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")

  // categories - update state
  const categories = ["All", "Appetizer", "Breakfast", "Dessert","Dinner", "Drinks", "Lunch"]
  const filteredRecipes = selectedCategory !== "All" 
    ? recipes.filter(recipe => recipe.category === selectedCategory)
    : recipes;
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  // store array of favorited recipes
  // prev.includes(recipeId) checks if it's already favorited
  // prev.filter(id => id !== recipeId) removes it from favorites
  // use spread operator [...prev, recipeId] and add recipe id to end of array if not previously favorited
  // to show recipe details for favorite recipe cards, map the favoriteRecipe (array of ids) to their full recipe objects
  // cannot pass favoriteRecipe directly to the FavoriteRecipeExcerpt without full recipe objects

  const recipeFaves = useCallback((recipe) => {
    const maxFaves = 6;

    setFavoriteRecipe(prev => {
      const isAlreadyFavorite = prev.some(fav => fav.id === recipe.id)

      if (isAlreadyFavorite) {
        return prev.filter(id => id !== recipe.id)
      } else if (prev.length < maxFaves) {
        return [...prev, recipe] 
      } else if (prev.length > maxFaves) {
        displayToast(`Favorite list is full!`)
      } else {
        return prev
      }
    })
  }, [])

  // load favorite recipes from local storage so when you refresh they stay favorited
    useEffect(() => {
      try {
        const savedRecipes = JSON.parse(localStorage.getItem("favoriteRecipe"));
        if (savedRecipes) {
          setFavoriteRecipe(savedRecipes);
      }
      } catch (error) {
        console.error("Error loading recipes", error);
        localStorage.removeItem("favoriteRecipe")
      }
    }, []);

    // save favorites to localStorage whenever they change
    useEffect(() => {
      localStorage.setItem("favoriteRecipe", JSON.stringify(favoriteRecipe));
    }, [favoriteRecipe]);
    
    // delete a favorite recipe - pass it a recipe.id to know the specific one to delete
    // remember favoriteRecipe is an array of ids, not objects so recipe.id is undefined
    const removefromFavorites = (recipeToRemove) => {
      setFavoriteRecipe(prev => prev.filter(r => r.id !== recipeToRemove.id))
    }

  // there is no id attribute since the database assigns one by default for each form submission
  const [newRecipe, setNewRecipe] = useState({
      title: "",
      cooking_time: "",
      category: "",
      ingredients: "",
      instructions: "",
      servings: 1, // conservative default
      description: "",
      image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
    });

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const response = await fetch("/api/recipes");
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
        } else {
          displayToast(`Cannot find that recipe!`, "error");
        }
      } catch (e) {
        displayToast("An unexpected error has occurred. Please try again later.", "error");
      }
    };
    fetchAllRecipes();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
  
    window.addEventListener("scroll", handleScroll);
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

        setRecipes([...recipes, data.recipe]);

        displayToast("Recipe added successfully!", "success");

        // this is happening once the user completes the form and saves it - with this the form goes away
        setShowNewRecipeForm(false);
        setNewRecipe({
          title: "",
          category: "",
          cooking_time: "",
          ingredients: "",
          instructions: "",
          servings: 1, // conservative default
          description: "",
          image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
        });
      } else {
        displayToast("Oops could not add recipe. Check to see if you're missing any information.", "error");
      }
    } catch (e) {
      displayToast(`An error has occurred - this recipe cannot be added.`, "error");
    }
  };

  /* Duplicated recipes */

  const isDuplicate = recipes.some(r => r.title.toLowerCase() === newRecipe.title.toLowerCase())
    if (isDuplicate) {
      displayToast("That recipe already exists!")
      return
    }

  /* handleUpdateRecipe function is similar to handleNewRecipe */
  /* except update an existing recipe */

  const handleUpdateRecipe = async (e, selectedRecipe) => {
    e.preventDefault();
  // you need the id to make sure the POST request reaches the correct endpoint
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
              return data.recipe;
            } 
            return recipe;
          })
        )
        displayToast("Recipe has been edited successfully!", "success")
      } else {
        displayToast("Oops! We cannot fetch the recipe!", "error")
      }
    } catch (error) {
        displayToast("An error has errored - you cannot edit or update this recipe.", "error")
    }
    setSelectedRecipe(null);
  }

  // Delete a recipe - no need for headers or body
  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE"
      });
  
      if (response.ok) {
        setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
        setSelectedRecipe(null); // Return to the excerpts view
        displayToast("Recipe successfully deleted!", "success");
      } else {
        displayToast("Oops! This recipe cannot be deleted!", "error");
      }
    } catch (error) {
      displayToast(`An error has occurred, this recipe cannot be deleted!`, "error");
    }
  };
  

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

  /* Query the database - search by terms */
  /* updateSearchTerm will accept a string or a value */
  const updateSearchTerm = (e0rValue) => {
    const value = typeof e0rValue === "string" ? e0rValue : e0rValue.target.value;
    setSearchTerm(value);
  }

  /* handleSearch accepts no parameters - 
  where we filter the recipe results and return 
  recipes with the searchTerm - no changes in state, just filtering*/
  /* the some method used on valuesToSearch looks like the filter method -
   it returns true if any item iterated over meets the criteria*/

  const handleSearch = () => {
    // search for titles first
    const titleSearch = searchTerm.toLowerCase();
    const titleMatches = recipes.filter((recipe => {
      return recipe.title.toLowerCase().includes(titleSearch)
    }))
    if (titleMatches.length > 0) return titleMatches;

    // if no title matches search for other fields
    return recipes.filter((recipe) => {
      const valuesToSearch=[recipe.ingredients, recipe.description];
      return valuesToSearch.some(value => value.toLowerCase().includes(searchTerm.toLowerCase()));
    });
  }

    /* make the logo clickable - clear the search results,
   newRecipeForm cannot show and no recipes can be selected */
   const displayAllRecipes = () => {
    hideRecipeForm();
    handleUnselectRecipe();
    updateSearchTerm("");
   }

  /* How to display recipes on search results page - is there a search term? */
  /* Alphabetize recipes - Use slice to copy arrays so recipes state isn't mutated 
  and sort to reorder elements - localeCompare handles case sensitivity and non English characters */
  
  const displayedRecipes = (searchTerm ? handleSearch() : recipes)
    .slice()
    .sort((a,b) => a.title.localeCompare(b.title));

  /* replace {JSON.stringify(recipes)} with a map over all recipes in state*/
  /* each recipe has an ID for the key and a prop for each recipe*/
  return (
    <div className='recipe-app'>
      <Header showRecipeForm={showRecipeForm} searchTerm={searchTerm} updateSearchTerm={updateSearchTerm} displayAllRecipes={displayAllRecipes} recipes={recipes} recipeFaves={favoriteRecipe} handleSelectRecipe={handleSelectRecipe} removefromFavorites={removefromFavorites}/>
      {showNewRecipeForm && (
        <NewRecipeForm newRecipe={newRecipe} hideRecipeForm={hideRecipeForm} onUpdateForm={onUpdateForm} handleNewRecipe={handleNewRecipe} categories={categories}/>
      )}
      {selectedRecipe && 
        <RecipeFull selectedRecipe={selectedRecipe} handleUnselectRecipe={handleUnselectRecipe} onUpdateForm={onUpdateForm} handleUpdateRecipe={handleUpdateRecipe} handleDeleteRecipe={handleDeleteRecipe} />
      }
      {!selectedRecipe && !showNewRecipeForm && (
      <div className="recipe-list">
        {displayedRecipes.map((recipe) => (
          <RecipeExcerpt key={recipe.id} recipe={recipe} handleSelectRecipe={handleSelectRecipe} favoriteRecipe={favoriteRecipe} setFavoriteRecipe={setFavoriteRecipe} recipeFaves={recipeFaves} removedromFavorites={removefromFavorites} />
        ))}
      {showScrollTop && !selectedRecipe && !showNewRecipeForm && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="back-to-top" aria-label="Scroll to top">
          ↑
          </button>
      )}
      </div>
      )}
      < ToastContainer />
    </div>
  );
}

export default App;