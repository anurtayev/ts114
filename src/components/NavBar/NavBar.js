import { useContext } from "react";
import { Switch, Route } from "react-router-dom";

import {
  NavBarContainer,
  Banner,
  StyledRouterLink,
  AmplifySignOutStyled,
} from "./NavBar.styles";
import { GlobalContext, routes } from "common";

export const NavBar = (props) => {
  const { user } = useContext(GlobalContext);

  if (!user) return null;

  return (
    <NavBarContainer>
      <Banner>{user.signInUserSession.idToken.payload.email}</Banner>

      <Switch>
        <Route path={routes.projectForm}>
          <StyledRouterLink to={routes.accounting}>Accounting</StyledRouterLink>
        </Route>
        <Route path={routes.projects}>
          <StyledRouterLink to={routes.accounting}>Accounting</StyledRouterLink>
          <StyledRouterLink
            to={`${
              routes.editForm
            }?formType=project&view=default&setCallbackURI=${encodeURI(
              routes.projects
            )}`}
          >
            New project
          </StyledRouterLink>
        </Route>
        <Route path={routes.accounting}>
          <StyledRouterLink to={routes.projects}>Projects</StyledRouterLink>
        </Route>
      </Switch>

      <AmplifySignOutStyled />
    </NavBarContainer>
  );
};
