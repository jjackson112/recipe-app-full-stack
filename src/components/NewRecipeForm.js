import React from "react";

const NewRecipeForm = () => {
    
    return (
       <div className="recipe-details">
        <h2>New Recipe</h2>
        <button className="cancel-button">Cancel</button>

        <form>
            <label>Title</label>
            <input type="text" name="title" value='' onChange='' required />
            <label>Ingredients</label>
            <textarea
                name="ingredients"
                value=''
                onChange=''
                required
                placeholder='Add ingredients separated bu commas - i.e. Flour, sugar, almonds' />
            <label>Instructions</label>
            <textarea
                name='instructions'
                value=''
                onChange=''
            />
            <label>Descriptions</label>
            <textarea
                name='description'
                value=''
                onChange=''
            />
            <label>Image</label>
            <input
                type=''
                name='image_url'
                value=''
                onChange=''
                required
            />
            <label>Servings</label>
            <input
                type='number'
                name='servings'
                value=''
                onChange=''
                required
            />
            <button type="submit">Save Recipe</button>
        </form>
       </div> 
    );
};

export default NewRecipeForm;