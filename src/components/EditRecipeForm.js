import React from "react";

/* update values to use update as the second argument */
/* update onChange to use new as the second argument */

const EditRecipeForm = ({selectedRecipe, handleCancel, onUpdateForm}) => {
    
    return (
        <div className="recipe-form">
            <h2>Edit "{selectedRecipe.title}"</h2>
            <button className="cancel-button" onClick={handleCancel}>Cancel</button>
            <form>
                <label>Title</label>
                <input
                    type="text"
                    name="title"
                    value={selectedRecipe.title}
                    onChange={(e) => onUpdateForm(e, "new")}
                    required
                />
                <label>Ingredients</label>
                <textarea
                    name="ingredients"
                    value={selectedRecipe.ingredients}
                    onChange={(e) => onUpdateForm(e, "new")}
                    required
                />
                <label>Instructions</label>
                <textarea
                    name="descriptions"
                    value={selectedRecipe.instructions}
                    onChange={(e) => onUpdateForm(e, "new")}
                    required
                />
                <label>Image</label>
                <textarea
                    type="text"
                    name="image_url"
                    value={selectedRecipe.image_url}
                    onChange={(e) => onUpdateForm(e, "new")}
                    required
                />
                <label>Servings</label>
                <textarea
                    type="number"
                    name="servings"
                    value={selectedRecipe.servings}
                    onChange={(e) => onUpdateForm(e, "new")}
                    required
                />
                <button type="submit">Update Recipe</button>
            </form>
        </div>
    );
};

export default EditRecipeForm;