/* Truncate text if it's 20 or more words*/
/* If text is null, undefined or an empty string (!text)*/
/* Slice returns a number of selected elements */

const truncateText = (text, numWords=125) => {
    if (!text) return "";
    return text.length > numWords ? text.slice(0, numWords) + "..." : text
};

export default truncateText;