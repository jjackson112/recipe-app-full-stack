import React from "react";

/* onSubmit to call handleNewRecipe */
/* update onChange to use new as the second argument */

const NewRecipeForm = ({newRecipe, hideRecipeForm, onUpdateForm, handleNewRecipe, categories }) => {
    
    return (
       <div className="recipe-details">
        <h2>New Recipe</h2>
        <button className="cancel-button" onClick={hideRecipeForm}>Cancel</button>

        <form onSubmit={(e) => handleNewRecipe(e, newRecipe)}>
            <label>Title</label>
            <input type="text" name="title" value={newRecipe.title} onChange={(e) => onUpdateForm(e, "new")} required />
            <label>Select a category</label>
            <select name="category" value={newRecipe.category} onChange={(e) => onUpdateForm(e, "new")} required>
                <option value="">-- Select a category --</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            <label>Cooking Time</label>
            <input type="text" name="cooking_time" id="cooking_time" value={newRecipe.cooking_time} onChange={(e) => onUpdateForm(e, "new")} />
            <label>Ingredients</label>
            <textarea
                name="ingredients"
                value={newRecipe.ingredients}
                onChange={(e) => onUpdateForm(e, "new")}
                required
                placeholder='Add ingredients separated by commas - i.e. Flour, sugar, almonds' />
            <label>Instructions</label>
            <textarea
                name='instructions'
                value={newRecipe.instructions}
                onChange={(e) => onUpdateForm(e, "new")}
            />
            <label>Description</label>
            <textarea
                name='description'
                value={newRecipe.description}
                onChange={(e) => onUpdateForm(e, "new")}
            />
            <label>Image</label>
            <input
                type=''
                name='image_url'
                value={newRecipe.image_url}
                onChange={(e) => onUpdateForm(e, "new")}
                required
            />
            <label>Servings</label>
            <input
                type='number'
                name='servings'
                value={newRecipe.servings}
                onChange={(e) => onUpdateForm(e, "new")}
                required
            />
            <button type="submit">Save Recipe</button>
        </form>
       </div> 
    );
};

export default NewRecipeForm;