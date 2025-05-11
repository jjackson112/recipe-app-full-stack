import React from "react";
import { Search } from "react-feather";
import { ReactComponent as Logo } from "../images/utensils.svg";
import FavoriteRecipeExcerpt from "./FavoriteRecipeExcerpt";

/* add value property to search input field and onChange to call updateSearchTerm to what was the user input */

const Header = ({ showRecipeForm, searchTerm, updateSearchTerm, displayAllRecipes, recipeFaves, recipes, handleSelectRecipe, removeFromFavorites }) => {
  return (
    <header>
      <div className='logo-search'>
        <Logo onClick={displayAllRecipes} />
        <div className='search'>
          <label className='visually-hidden' htmlFor='search'>
            Search
          </label>
          <input
            type='text'
            placeholder='Search'
            id='search'
            value={searchTerm}
            onChange={updateSearchTerm}
          />
          <Search aria-label="Search icon"/>
        </div>
      </div>
      <h1>My Favorite Recipes</h1>
      <button className='new-recipe' onClick={showRecipeForm}>
        Add New Recipe
      </button>
      <div className="favorite-recipes">
        <h2>5 most liked recipes</h2>
          <div className="favorite-recipes-list">
          {recipeFaves.length === 0 ? (
            <p>No favorites yet?</p>
          ) : (
            recipeFaves
              .map(id => recipes.find(r => r.id === id))
              .filter(Boolean)
              .map(recipe => (
                <FavoriteRecipeExcerpt key={recipe.id} recipe={recipe} handleSelectRecipe={handleSelectRecipe} removeFromFavorites={removeFromFavorites} />
              ))
          )}
          </div>
      </div>
    </header>
  );
};

export default Header;