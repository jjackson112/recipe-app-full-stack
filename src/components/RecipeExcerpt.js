import React from "react";
import truncateText from "../helpers/utils";
import { Heart } from "react-feather";
import { useState } from "react";

/* Check get recipe app route for properties*/
/* Wrap recipe.description with truncateText - call the default value as a second argument  */

const RecipeExcerpt = ({recipe, handleSelectRecipe, recipeFaves }) => {
    const [isFilled, setIsFilled] = useState(false)
    // recipeFaves expects a recipeId so it is called with recipe.id not recipe
    const handleIcon = () => {
        recipeFaves(recipe.id)
        setIsFilled(!isFilled) // or (prev => ! prev meaning that it takes the previous state value and returns its opposite - it can flip)
    }

    return (
        <article className="recipe-card">
            <figure>
                <img src={recipe.image_url} alt={recipe.title} />
            </figure>
            <span className="add-favorite">
                <Heart 
                    onClick = {handleIcon}
                    fill= {isFilled ? "#ff6347" : "none"}
                    cursor="pointer"
                />
            </span>
            <h2>{recipe.title}</h2>
            <p className="flex-spacing">{truncateText(recipe.description, 125)}</p>
            <button onClick={() => handleSelectRecipe(recipe)}>View</button>
        </article>
    )
}

export default RecipeExcerpt;
