import React from "react";
import truncateText from "../helpers/utils";

/* Check get recipe app route for properties*/
/* Wrap recipe.description with truncateText - call the default value as a second argument  */

const FavoriteRecipeExcerpt = ({recipe, handleSelectRecipe, removefromFavorites }) => {

    return (
        <article className="recipe-card">
            <span className="close-recipe-card" onClick={() => removefromFavorites(recipe.id)}>X</span>
            <figure>
                <img src={recipe.image_url} alt={recipe.title} />
            </figure>
            <h2>{recipe.title}</h2>
            <p className="flex-spacing">{truncateText(recipe.description, 125)}</p>
            <button onClick={() => handleSelectRecipe(recipe)}>View</button>
        </article>
    )
}

export default FavoriteRecipeExcerpt;