import { createContext } from "react";

export const routes = {
  accounting: "/accounting",
  timesheets: "/timesheets",
  projects: "/projects",
};

export const securityGroups = {
  administrators: "Administrators",
  users: "Users",
};

export const defaultRoutes = {};
defaultRoutes[securityGroups.administrators] = routes.accounting;
defaultRoutes[securityGroups.users] = routes.timesheets;

export const GlobalContext = createContext();

export const isAdmin = (user) =>
  user
    ? user.signInUserSession.idToken.payload["cognito:groups"].includes(
        securityGroups.administrators
      )
    : false;

export const getDefaultRoute = (user) =>
  isAdmin(user)
    ? defaultRoutes[securityGroups.administrators]
    : defaultRoutes[securityGroups.users];
