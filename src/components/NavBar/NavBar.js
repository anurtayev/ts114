import { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import {
  NavBarContainer,
  Banner,
  StyledRouterLink,
  AmplifySignOutStyled,
} from "./NavBar.styles";
import { GlobalContext, routes } from "common";

export const NavBar = (props) => {
  const { user } = useContext(GlobalContext);
  const {
    signInUserSession: {
      idToken: {
        payload: { email },
      },
    },
  } = user;

  if (!user) return null;

  return (
    <NavBarContainer>
      <Banner>{email}</Banner>

      <Switch>
        <Route path={routes.projectForm}>
          <StyledRouterLink to={routes.accounting}>Accounting</StyledRouterLink>
        </Route>
        <Route path={routes.projects}>
          <StyledRouterLink to={routes.accounting}>Accounting</StyledRouterLink>
          <StyledRouterLink
            to={`${
              routes.editForm
            }?entityType=project&view=default&callbackURI=${btoa(
              routes.projects
            )}&formObject=${btoa(
              JSON.stringify({ id: uuidv4(), name: "", number: "", tasks: [] })
            )}`}
          >
            New project
          </StyledRouterLink>
        </Route>
        <Route path={routes.accounting}>
          <StyledRouterLink to={routes.projects}>Projects</StyledRouterLink>
        </Route>
        <Route path={routes.timesheets}>
          <StyledRouterLink
            to={`${
              routes.editForm
            }?entityType=record&view=edit&callbackURI=${btoa(
              routes.timesheets
            )}&formObject=${btoa(
              JSON.stringify({
                id: uuidv4(),
                project: "",
                projectTask: "",
                date: "",
                hours: 0,
                description: "",
                submitted: false,
                invoiced: false,
                userId: email,
              })
            )}`}
          >
            New entry
          </StyledRouterLink>
        </Route>
      </Switch>

      <AmplifySignOutStyled />
    </NavBarContainer>
  );
};
