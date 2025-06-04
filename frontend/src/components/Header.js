import React, { useState } from "react";
import { Search } from "react-feather";
import { ReactComponent as Logo } from "../images/utensils.svg";
import FavoriteRecipeExcerpt from "./FavoriteRecipeExcerpt";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

/* add value property to search input field and onChange to call updateSearchTerm to what was the user input */

const Header = ({ showRecipeForm, searchTerm, updateSearchTerm, displayAllRecipes, recipeFaves, recipes, handleSelectRecipe, removefromFavorites, categories, selectedCategory, handleCategoryChange }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  const { isLoggedIn, user, logout } = useAuth(); // Correctly using the hook

  const navigate = useNavigate(); // logout

  return (
    <header>
      <div className='logo-search'>
        <Logo onClick={displayAllRecipes} />
        <div className="login">
           {isLoggedIn && user?.username ? (
            <>
              <span className="welcome-message">Hi, <strong>{user?.username}</strong> you are logged in! </span>
              <a href="/" onClick={(e) => {
                e.preventDefault();  // Prevent default navigation
                logout();            // Clear token and auth state
                navigate("/");       // Programmatic navigation
              }}
              >Logout</a>
            </>
           ) : (
          <>
            <button id="login-btn" className="header-auth-btns" onClick={() => setShowLoginModal(true)}>Login</button>
            {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
          </>
        )}
        </div>

        <div className="register">
          {!isLoggedIn && (
            <>
              <button id="register-btn" className="header-auth-btns" onClick={() => setShowRegisterModal(true)}>Register</button>
              {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
            </>
          )}
        </div>

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
      <div className="favorite-recipes-list">
        {recipeFaves.length === 0 ? (
          <p>No favorites yet?</p>
        ) : (
        recipeFaves.map(recipe => (
          <FavoriteRecipeExcerpt
            key={recipe.id}
            recipe={recipe}
            handleSelectRecipe={handleSelectRecipe}
            removefromFavorites={removefromFavorites}
          />
          ))
        )}
      </div>

      <div className="category-filter">
        <label htmlFor="category"><strong>Filter by category </strong></label>
        <select id="category" value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
          {categories.map((cat) => (
            <option id="category-options" key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

    </header>
  );
};

export default Header;