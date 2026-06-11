// storage.js

// Save user in localStorage
function saveUser(user) {
  localStorage.setItem("cb_user", JSON.stringify(user));
}

// Get user
function getUser() {
  return JSON.parse(localStorage.getItem("cb_user")) || null;
}

// Check signed in
function isSignedIn() {
  return !!getUser();
}

// Sign out
function signOut() {
  localStorage.removeItem("cb_user");
  location.reload();
}


