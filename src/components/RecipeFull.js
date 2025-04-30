import React, { useState }  from "react";
import { X } from "react-feather";
import EditRecipeForm from "./EditRecipeForm";

const [editing, setEditing] = useState(false)

const handleCancel = () => {
    setEditing(false)
}

const RecipeFull = ({selectedRecipe, handleUnselectRecipe}) => {

    return(
        <div className="recipe-details">
            {editing ? (<EditRecipeForm />
            ) :
            <article>
                <header>
                    <figure>
                        <img src={selectedRecipe.image_url} alt={selectedRecipe.image_url}/>
                    </figure>
                    <h2>{selectedRecipe.title}</h2>
                    <div className="button-container">
                        <button className="edit-button" onClick={() => setEditing(true)}>Edit</button>
                        <button className="cancel-button" onClick={handleUnselectRecipe}><X />Close</button>
                        <button className="delete-button">Delete</button>
                    </div>
                </header>

                <h3>Description:</h3>
                <p>{selectedRecipe.description}</p>

                <h3>Ingredients</h3>

                <ul className="ingredient-list">
                    {selectedRecipe.ingredients.split(",").map((ingredient, index) => (
                    <li key={index} className="ingredient">
                    {ingredient}
                    </li>
                    ))}
                </ul>

                <h3>Instructions:</h3>

                <pre className="formatted-text">{selectedRecipe.instructions}</pre>

                <h3>Servings: {selectedRecipe.servings}</h3>
            </article>
            }   
        </div>
    )
}

export default RecipeFull;