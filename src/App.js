import React, { useEffect, useState } from "react";
import {
  AmplifyAuthenticator,
  AmplifySignUp,
  AmplifySignIn,
} from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { Switch, Route, useHistory } from "react-router-dom";

import { GlobalContext, getDefaultRoute, routes } from "common";
import { AccountingScreen } from "components/AccountingScreen";
import { ProjectForm } from "components/ProjectForm";
import { ProjectsScreen } from "components/ProjectsScreen";
import { TimesheetScreen } from "components/TimesheetScreen";
import { NavBar } from "components/NavBar";

export const App = () => {
  const [authState, setAuthState] = useState();
  const [user, setUser] = useState();
  const history = useHistory();

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);

  useEffect(() => {
    history && user && history.push(getDefaultRoute(user));
  }, [history, user]);

  return authState === AuthState.SignedIn && user ? (
    <GlobalContext.Provider value={{ user }}>
      <NavBar />
      <Switch>
        <Route exact path={routes.accounting}>
          <AccountingScreen />
        </Route>
        <Route path={routes.timesheets}>
          <TimesheetScreen />
        </Route>
        <Route path={routes.projects}>
          <ProjectsScreen />
        </Route>
        <Route path={`${routes.projectForm}/:projectId`}>
          <ProjectForm />
        </Route>
        <Route path={routes.projectForm}>
          <ProjectForm />
        </Route>
      </Switch>
    </GlobalContext.Provider>
  ) : (
    <AmplifyAuthenticator usernameAlias="email">
      <AmplifySignUp
        slot="sign-up"
        usernameAlias="email"
        formFields={[
          {
            type: "email",
            label: "Email",
            placeholder: "Please enter your email address",
            required: true,
          },
          {
            type: "password",
            label: "Password",
            placeholder: "Please enter your password",
            required: true,
          },
        ]}
      />
      <AmplifySignIn slot="sign-in" usernameAlias="email" />
    </AmplifyAuthenticator>
  );
};
