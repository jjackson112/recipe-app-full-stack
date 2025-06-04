// abstracting token retrieval into a helper file is a clean and maintainable way to manage authentication-related logic

function getAuthToken() {
  return localStorage.getItem('token');
}

export default getAuthToken;