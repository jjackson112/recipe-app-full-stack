import React, { useState, useEffect} from "react";
import truncateText from "../helpers/utils";
import { Heart } from "react-feather";

/* Check get recipe app route for properties*/
/* Wrap recipe.description with truncateText - call the default value as a second argument  */

const RecipeExcerpt = ({recipe, handleSelectRecipe, recipeFaves, favoriteRecipe }) => {
    const [isFilled, setIsFilled] = useState(false)

    // check is the current recipe id exists in favoriteRecipe array
    useEffect (() => {
        const isCurrentlyFavorite = favoriteRecipe.some(fav => fav.id === recipe.id)
        setIsFilled(isCurrentlyFavorite)
    }, [favoriteRecipe, recipe.id]) // Run this effect when favoriteRecipe or recipe.id changes

    // recipeFaves expects a recipeId so it is called with recipe.id not recipe
    // this has been updated to just recipe to return the full object recipe
    const handleIcon = () => {
        recipeFaves(recipe) // updates the favoriteRecipe state
        // setIsFilled(!isFilled) no longer needed, since useEffect is global
        // or (prev => ! prev meaning that it takes the previous state value and returns its opposite - it can flip)
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
                    stroke="#ff6347"
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
