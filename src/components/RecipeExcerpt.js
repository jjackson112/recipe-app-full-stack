import React from "react";

/* Check get recipe app route for properties*/

const RecipeExcerpt = ({recipe, handleSelectRecipe}) => {
    return (
        <article className="recipe-card">
        <figure>
            <img src={recipe.image_url} alt={recipe.image_url} />
        </figure>
        <h2>{recipe.title}</h2>
        <p className="flex-spacing">{recipe.description}</p>
        <button onClick={() => handleSelectRecipe(recipe)}>View</button>
    </article>
    )
}

export default RecipeExcerpt;