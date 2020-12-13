import { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";
import { saveAs } from "file-saver";
import { unparse } from "papaparse";

import { listRecords } from "graphql/queries";
import { updateRecord, deleteRecord } from "graphql/mutations";
import {
  NavBarContainer,
  Banner,
  StyledRouterLink,
  AmplifySignOutStyled,
  NavButton,
} from "./NavBar.styles";
import { GlobalContext, routes } from "common";

export const NavBar = ({ updateValue }) => {
  const { user, forceUpdate } = useContext(GlobalContext);
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
        <Route path={routes.projects}>
          <StyledRouterLink to={routes.accounting}>Accounting</StyledRouterLink>
          <StyledRouterLink
            to={`${routes.editForm}?entityType=project&isNew&callbackURI=${btoa(
              routes.projects
            )}&formObject=${btoa(
              JSON.stringify({ name: "", number: "", tasks: [] })
            )}`}
          >
            New project
          </StyledRouterLink>
        </Route>
        <Route path={routes.accounting}>
          <StyledRouterLink to={routes.projects}>Projects</StyledRouterLink>
          <NavButton
            onClick={() =>
              API.graphql(
                graphqlOperation(listRecords, {
                  filter: { invoiced: { eq: false }, submitted: { eq: true } },
                })
              )
                .then(({ data: { listRecords: { items } } }) =>
                  Promise.all(
                    items.map(({ id }) =>
                      API.graphql(
                        graphqlOperation(updateRecord, {
                          input: {
                            id,
                            invoiced: true,
                          },
                        })
                      )
                    )
                  )
                )
                .then((items) => {
                  var blob = new Blob(
                    [
                      unparse(
                        items
                          .map((item) => item.data.updateRecord)
                          .map((item) => ({
                            projectName: item.project.name,
                            projectNumber: item.project.number,
                            projectTask: item.projectTask,
                            date: item.date,
                            hours: item.hours,
                            description: item.description,
                            userId: item.userId,
                          }))
                      ),
                    ],
                    {
                      type: "text/plain;charset=utf-8",
                    }
                  );
                  saveAs(
                    blob,
                    `invoiceData-${new Date()
                      .toISOString()
                      .replace(/[-:T.]/g, "")
                      .substring(0, 14)}.csv`
                  );
                })
                .then(() => forceUpdate())
                .catch((err) => console.error(err))
            }
          >
            Invoice
          </NavButton>
          <NavButton
            onClick={() =>
              API.graphql(
                graphqlOperation(listRecords, {
                  filter: { invoiced: { eq: true } },
                })
              )
                .then(({ data: { listRecords: { items } } }) =>
                  Promise.all(
                    items.map(({ id }) =>
                      API.graphql(
                        graphqlOperation(deleteRecord, {
                          input: {
                            id,
                          },
                        })
                      )
                    )
                  )
                )
                .then(() => forceUpdate())
                .catch((err) => console.error(err))
            }
          >
            Wipe out
          </NavButton>
        </Route>
        <Route path={routes.timesheets}>
          <StyledRouterLink
            to={`${routes.editForm}?entityType=record&isNew&callbackURI=${btoa(
              routes.timesheets
            )}&formObject=${btoa(
              JSON.stringify({
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
              API.graphql(
                graphqlOperation(listRecords, {
                  filter: { userId: { eq: email } },
                })
              )
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
                .then(() => forceUpdate())
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
