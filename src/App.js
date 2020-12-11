import React, { useEffect, useState } from "react";
import {
  AmplifyAuthenticator,
  AmplifySignUp,
  AmplifySignIn,
} from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { Switch, Route, useHistory } from "react-router-dom";

import { GlobalContext, getDefaultRoute, routes, useForceUpdate } from "common";
import { RecordsScreen } from "components/RecordsScreen";
import { ProjectsScreen } from "components/ProjectsScreen";
import { EditForm } from "components/EditForm";
import { NavBar } from "components/NavBar";

export const App = () => {
  const [authState, setAuthState] = useState();
  const [user, setUser] = useState();
  const history = useHistory();
  const { updateValue, forceUpdate } = useForceUpdate();

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);

  useEffect(() => {
    history &&
      user &&
      user.signInUserSession &&
      history.push(getDefaultRoute(user));
  }, [history, user]);

  return authState === AuthState.SignedIn && user && user.signInUserSession ? (
    <GlobalContext.Provider value={{ user, forceUpdate }} key={updateValue}>
      <NavBar />
      <Switch>
        <Route exact path={routes.accounting}>
          <RecordsScreen
            view="accounting"
            editFormReturnUrl={routes.accounting}
          />
        </Route>
        <Route path={routes.timesheets}>
          <RecordsScreen
            view="timesheets"
            editFormReturnUrl={routes.timesheets}
          />
        </Route>
        <Route path={routes.projects}>
          <ProjectsScreen />
        </Route>
        <Route path={routes.editForm}>
          <EditForm />
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
