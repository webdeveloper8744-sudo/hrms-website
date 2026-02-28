export const saveAuth = (token: string, user: any) => {
  localStorage.setItem("auth_token", token);
  localStorage.setItem("auth_user", JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
};
