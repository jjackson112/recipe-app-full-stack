// abstracting token retrieval into a helper file is a clean and maintainable way to manage authentication-related logic

export default function getAuthToken() {
  return localStorage.getItem('token');
}
