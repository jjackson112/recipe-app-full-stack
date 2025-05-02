import React from "react";
import truncateText from "../helpers/utils";

/* Check get recipe app route for properties*/
/* Wrap recipe.description with truncateText - call the default value as a second argument  */

const RecipeExcerpt = ({recipe, handleSelectRecipe}) => {
    return (
        <article className="recipe-card">
        <figure>
            <img src={recipe.image_url} alt={recipe.image_url} />
        </figure>
        <h2>{recipe.title}</h2>
        <p className="flex-spacing">{truncateText(recipe.description, 125)}</p>
        <button onClick={() => handleSelectRecipe(recipe)}>View</button>
    </article>
    )
}

export default RecipeExcerpt;