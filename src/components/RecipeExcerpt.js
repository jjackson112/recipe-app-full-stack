import React from "react";

/* Check get recipe app route for properties*/

const RecipeExcerpt = ({recipe}) => {

    return (
        <article className="recipe-card">
        <figure>
            <img src={recipe.image_url} alt={recipe.title} />
        </figure>
        <h2>{recipe.title}</h2>
        <p className="flex-spacing">{recipe.description}</p>
        <button>View</button>
    </article>
    )
}

export default RecipeExcerpt;