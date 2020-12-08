import styled from "styled-components";
import { Link } from "react-router-dom";
import { AmplifySignOut } from "@aws-amplify/ui-react";
import { ContainerStyles } from "common";

export const NavBarContainer = styled(styled.div([ContainerStyles]))`
  background: ${(props) => props.theme.primaryColor};
  display: flex;
  align-items: center;
`;

export const Banner = styled.div``;

export const ClickableElementStyles = `
  margin: 0 1em;
  background-color: rgba(255, 153, 0);
  color: white;
  height: 49px;
  text-align: center;
  display: flex;
  align-items: center;
  padding: 0 1em;
  text-decoration: none;
  font-family: "Amazon Ember", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-stretch: 100%;
  font-weight: 600;
  font-style: normal;
  letter-spacing: 0.75px;
  text-transform: uppercase;
`;

export const StyledRouterLink = styled(Link)([ClickableElementStyles]);

export const NavButton = styled.div([ClickableElementStyles]);

export const AmplifySignOutStyled = styled(AmplifySignOut)`
  margin: 0 1em;
`;
