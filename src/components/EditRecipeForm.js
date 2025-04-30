import React from "react";

const EditRecipeForm = (selectedRecipe, handleCancel) => {
    
    return (
        <div className="recipe-form">
            <h2>Edit "{selectedRecipe.title}"</h2>
            <button className="cancel-button" onClick={handleCancel}>Cancel</button>
            <form>
                <label>Title</label>
                <input
                    type="text"
                    name="title"
                    value=''
                    onChange=''
                    required
                />
                <label>Ingredients</label>
                <textarea
                    name="ingredients"
                    value=''
                    onChange=''
                    required
                />
                <label>Instructions</label>
                <textarea
                    name="descriptions"
                    value=''
                    onChange=''
                    required
                />
                <label>Image</label>
                <textarea
                    type="text"
                    name="image_url"
                    value=''
                    onChange=''
                    required
                />
                <label>Servings</label>
                <textarea
                    type="number"
                    name="servings"
                    value=''
                    onChange=''
                    required
                />
                <button type="submit">Update Recipe</button>
            </form>
        </div>
    );
};

export default EditRecipeForm;