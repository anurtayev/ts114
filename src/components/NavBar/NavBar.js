import { useContext } from "react";

import {
  NavBarContainer,
  Banner,
  StyledRouterLink,
  AmplifySignOutStyled,
} from "./NavBar.styles";
import { GlobalContext, routes, isAdmin } from "common";

export const NavBar = (props) => {
  const { user } = useContext(GlobalContext);

  if (!user) return null;

  return (
    <NavBarContainer>
      <Banner>{user.signInUserSession.idToken.payload.email}</Banner>

      {isAdmin(user) && (
        <>
          <StyledRouterLink to={routes.accounting}>Accounting</StyledRouterLink>
          <StyledRouterLink to={routes.projects}>Projects</StyledRouterLink>
        </>
      )}

      <AmplifySignOutStyled />
    </NavBarContainer>
  );
};
