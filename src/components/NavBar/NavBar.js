import { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { API, graphqlOperation } from "aws-amplify";

import { listRecords } from "graphql/queries";
import { updateRecord } from "graphql/mutations";
import {
  NavBarContainer,
  Banner,
  StyledRouterLink,
  AmplifySignOutStyled,
  NavButton,
} from "./NavBar.styles";
import { GlobalContext, routes } from "common";

export const NavBar = ({ updateValue }) => {
  const { user, globalForceUpdate } = useContext(GlobalContext);
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
            to={`${routes.editForm}?entityType=project&isNew&callbackURI=${btoa(
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
            to={`${routes.editForm}?entityType=record&isNew&callbackURI=${btoa(
              routes.timesheets
            )}&formObject=${btoa(
              JSON.stringify({
                id: uuidv4(),
                recordProjectId: "",
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
          <NavButton
            onClick={() =>
              API.graphql(graphqlOperation(listRecords), {
                filter: { userId: { eq: email } },
              })
                .then(({ data: { listRecords: { items } } }) =>
                  Promise.all(
                    items.map(({ id }) =>
                      API.graphql(
                        graphqlOperation(updateRecord, {
                          input: {
                            id,
                            submitted: true,
                          },
                        })
                      )
                    )
                  )
                )
                .then(() => globalForceUpdate())
                .catch((err) => console.error(err))
            }
          >
            Submit
          </NavButton>
        </Route>
      </Switch>

      <AmplifySignOutStyled />
    </NavBarContainer>
  );
};
