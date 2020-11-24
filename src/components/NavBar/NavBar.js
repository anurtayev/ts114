import { AmplifySignOut } from "@aws-amplify/ui-react";
import { useContext } from "react";
import { Link } from "react-router-dom";

import { NavBarContainer, Banner } from "./NavBar.styles";
import { GlobalContext, routes, isAdmin } from "common";

export const NavBar = (props) => {
  const { user } = useContext(GlobalContext);

  if (!user) return null;

  return (
    <NavBarContainer>
      <Banner>{user.signInUserSession.idToken.payload.email}</Banner>

      {isAdmin(user) && (
        <ul>
          <li>
            <Link to={routes.accounting}>Accounting</Link>
          </li>
          <li>
            <Link to={routes.projects}>Projects</Link>
          </li>
        </ul>
      )}

      <AmplifySignOut />
    </NavBarContainer>
  );
};
