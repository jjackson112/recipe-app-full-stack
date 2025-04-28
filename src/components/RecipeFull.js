import React from "react";

const RecipeFull = () => {
    return(
        <div className="recipe-details">
            <article>
                <header>
                    <figure>
                        <img />
                    </figure>
                    <h2>{}</h2>
                    <div className="button-container">
                        <button className="edit-button">Edit</button>
                        <button className="cancel-button">Close</button>
                        <button className="delete-button">Delete</button>
                    </div>
                </header>

                <h3>Description:</h3>
                <p>{}</p>

                <h3>Ingredients</h3>

                <ul className="ingredient-list"></ul>

                <h3>Instructions:</h3>

                <pre className="formatted-text">{}</pre>

                <h3>Servings: {}</h3>
            </article>
        </div>
    )
}

export default RecipeFull;