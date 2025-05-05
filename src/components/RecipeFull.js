import React from "react";
import { useState, useEffect } from "react";
import EditRecipeForm from "./EditRecipeForm";
import ConfirmationModal from "./ConfirmationModal";
import { X } from "react-feather";

const unicodeFractions = {
    "1/2": "½",
    "1/3": "⅓",
    "2/3": "⅔",
    "1/4": "¼",
    "3/4": "¾",
    "1/5": "⅕",
    "2/5": "⅖",
    "3/5": "⅗",
    "4/5": "⅘",
    "1/6": "⅙",
    "5/6": "⅚",
    "1/8": "⅛",
    "3/8": "⅜",
    "5/8": "⅝",
    "7/8": "⅞"
  };

  const toDecimal = (str) => {
    if (str.includes(' ')) {
      const [whole, frac] = str.split(' ');
      const [num, denom] = frac.split('/');
      return parseInt(whole) + parseInt(num) / parseInt(denom);
    }
    if (str.includes('/')) {
      const [num, denom] = str.split('/');
      return parseInt(num) / parseInt(denom);
    }
    return parseFloat(str);
  };
  
  const toUnicodeFraction = (value) => {
    const whole = Math.floor(value);
    const decimal = value - whole;
  
    let closest = null;
    let minDiff = Infinity;
  
    for (const [frac, symbol] of Object.entries(unicodeFractions)) {
      const [num, denom] = frac.split('/').map(Number);
      const decimalVal = num / denom;
      const diff = Math.abs(decimalVal - decimal);
      if (diff < minDiff) {
        minDiff = diff;
        closest = symbol;
      }
    }
  
    if (minDiff <= 0.05) {
        // Use Unicode fraction
        return whole > 0 ? `${whole} ${closest}` : `${closest}`;
      } else {
        // Fallback to decimal, trimmed
        const rounded = Math.round(value * 100) / 100;
        return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(2);
      }
    };

const RecipeFull = ({selectedRecipe, handleUnselectRecipe, onUpdateForm, handleUpdateRecipe, handleDeleteRecipe}) => {
    const [editing, setEditing] = useState(false)
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const [multiplier, setMultiplier] = useState(1);

// handle multiplier for servings
const handleMultiplierClick = (value) => {
    if (value === 1) {
      setMultiplier(1);
    } else if (value === 2) {
      setMultiplier(2);
    } else if (value === 3) {
      setMultiplier(3);
    }
  };  

// make sure recipe opens to the top when full recipw view is clicked
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
      
    const handleCancel = () => {
        setEditing(false)
    }

    if (showConfirmationModal === true) {
        return (
            <div className="recipe-details">
                <ConfirmationModal 
                    message="Are you sure? Once it's gone, it's gone."
                    onCancel={() => setShowConfirmationModal(false)}
                    onConfirm={() => handleDeleteRecipe(selectedRecipe.id)}
                />
            </div>
        )
    }

    return (
        <div className="recipe-details">
            {editing ? (<EditRecipeForm selectedRecipe={selectedRecipe} handleCancel={handleCancel} handleUpdateRecipe={handleUpdateRecipe} onUpdateForm={onUpdateForm}/>
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
                        <button className="delete-button" onClick={() => setShowConfirmationModal(true)}>Delete</button>
                    </div>
                </header>
                <h3>Description:</h3>
                <p>{selectedRecipe.description}</p>

                <h3>Cooking Time: {selectedRecipe.cooking_time}</h3>
                <h3>Servings: {selectedRecipe.servings * multiplier}</h3>
                
                <h3>Ingredients</h3>
                <h4>If you'd like to double or triple the recipe, click the appropriate button.</h4>

                <div class="scale-buttons">
                    <button onClick={() => handleMultiplierClick(1)} className={multiplier === 1 ? "active" : ""}
                    >1x</button>
                    <button onClick={() => handleMultiplierClick(2)} className={multiplier === 2 ? "active" : ""}
                    >2x</button>
                    <button onClick={() => handleMultiplierClick(3)} className={multiplier === 3 ? "active" : ""}
                    >3x</button>
                </div>

         
                <ul className="ingredient-list">
                    {selectedRecipe.ingredients.split(",").map((ingredient, index) => {
                        const updatedIngredient = ingredient.replace(/(\d+\s\d+\/\d+|\d+\/\d+|\d+(\.\d+)?)/g, (match) => {
                            const scaled = toDecimal(match) * multiplier
                            return toUnicodeFraction(scaled)
                        })
                        return (
                            <li key={index} className="ingredient">
                            {updatedIngredient}
                            </li>
                        )
                    })}
                </ul>

                <h3>Instructions:</h3>

                <pre className="formatted-text">{selectedRecipe.instructions}</pre>

            </article>
            }   
        </div>
    )
}

export default RecipeFull;