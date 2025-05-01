import React from "react";
/* onSubmit to call handleNewRecipe */

const NewRecipeForm = (newRecipe, hideRecipeForm, onUpdateForm, handleNewRecipe) => {
    
    return (
       <div className="recipe-details">
        <h2>New Recipe</h2>
        <button className="cancel-button" onClick={hideRecipeForm}>Cancel</button>
        
        <form onSubmit={(e) => handleNewRecipe(e, newRecipe)}>
            <label>Title</label>
            <input type="text" name="title" value={newRecipe.title} onChange={(e) => onUpdateForm(e)} required />
            <label>Ingredients</label>
            <textarea
                name="ingredients"
                value={newRecipe.ingredients}
                onChange={(e) => onUpdateForm(e)}
                required
                placeholder='Add ingredients separated bu commas - i.e. Flour, sugar, almonds' />
            <label>Instructions</label>
            <textarea
                name='instructions'
                value={newRecipe.instructions}
                onChange={(e) => onUpdateForm(e)}
            />
            <label>Descriptions</label>
            <textarea
                name='description'
                value={newRecipe.description}
                onChange={(e) => onUpdateForm(e)}
            />
            <label>Image</label>
            <input
                type=''
                name='image_url'
                value={newRecipe.image_url}
                onChange={(e) => onUpdateForm(e)}
                required
            />
            <label>Servings</label>
            <input
                type='number'
                name='servings'
                value={newRecipe.servings}
                onChange={(e) => onUpdateForm(e)}
                required
            />
            <button type="submit">Save Recipe</button>
        </form>
       </div> 
    );
};

export default NewRecipeForm;