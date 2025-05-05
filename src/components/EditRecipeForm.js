import React from "react";

/* update onChange to use new as the second argument */

const EditRecipeForm = ({selectedRecipe, handleCancel, onUpdateForm, handleUpdateRecipe}) => {
    
    return (
        <div className="recipe-form">
            <h2>Edit "{selectedRecipe.title}"</h2>
            <button className="cancel-button" onClick={handleCancel}>Cancel</button>
            <form onSubmit={(e) => handleUpdateRecipe(e, selectedRecipe)}>
                <label>Title</label>
                <input
                    type="text"
                    name="title"
                    value={selectedRecipe.title}
                    onChange={(e) => onUpdateForm(e, "update")}
                    required
                />
                <label>Description</label>
                <input 
                    type="text"
                    name="description"
                    value={selectedRecipe.description}
                    onChange={(e) => onUpdateForm(e, "update")}
                    required
                />    
                <label>Cooking Time</label>
                <input
                    type="text"
                    name="cooking_time"
                    value={selectedRecipe.cooking_time}
                    onChange={(e) => onUpdateForm(e, "update")}
                    required
                />
                <label>Ingredients</label>
                <textarea
                    name="ingredients"
                    value={selectedRecipe.ingredients}
                    onChange={(e) => onUpdateForm(e, "update")}
                    required
                />
                <label>Instructions</label>
                <textarea
                    name="instructions"
                    value={selectedRecipe.instructions}
                    onChange={(e) => onUpdateForm(e, "update")}
                    required
                />
                <label>Image URL</label>
                <textarea
                    type="text"
                    name="image_url"
                    value={selectedRecipe.image_url}
                    onChange={(e) => onUpdateForm(e, "update")}
                    required
                />
                <label>Servings</label>
                <textarea
                    type="number"
                    name="servings"
                    value={selectedRecipe.servings}
                    onChange={(e) => onUpdateForm(e, "update")}
                    required
                />
                <button id ="edit-cancel-button" type="submit">Update Recipe</button>
            </form>
        </div>
    );
};

export default EditRecipeForm;