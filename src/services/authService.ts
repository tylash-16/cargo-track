export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "123456";

export function login(username: string, password: string) {
  if (
    username === ADMIN_USERNAME &&
    password === ADMIN_PASSWORD
  ) {
    localStorage.setItem("isLoggedIn", "true");
    return true;
  }

  return false;
}

export function logout() {
  localStorage.removeItem("isLoggedIn");
}

export function isLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}