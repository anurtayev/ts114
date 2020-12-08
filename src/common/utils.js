import { createContext, useState } from "react";

export const routes = {
  accounting: "/accounting",
  timesheets: "/timesheets",
  projects: "/projects",
  editForm: "/edit-form",
};

export const securityGroups = {
  administrators: "Administrators",
  users: "Users",
};

export const defaultRoutes = {
  [securityGroups.administrators]: routes.accounting,
  [securityGroups.users]: routes.timesheets,
};

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

export function useForceUpdate() {
  let [updateValue, setValue] = useState(0);
  return {
    updateValue,
    forceUpdate: () => setValue((updateValue) => ++updateValue),
  };
}
