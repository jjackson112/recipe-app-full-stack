import React from "react";

const CategoryFilter = ({ categories, selectedCategory}) => {
    return (
        <div className="category-filter">
            <select value={selectedCategory}>
                <option value="All">All</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
            ))}
            </select>
        </div>
    )
}

export default CategoryFilter;