import styled, { keyframes } from "styled-components";
import { ContainerStyles } from "common";

export const Container = styled(styled.div([ContainerStyles]))`
  background: ${(props) => props.theme.primaryColor};
  display: flex;
  justify-content: center;
`;

const rotate = keyframes`
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
`;

export const LoadingIndicator = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;

  &:after {
    background-color: red;
    content: " ";
    display: block;
    border-radius: 50%;
    width: 0;
    height: 0;
    margin: 8px;
    box-sizing: border-box;
    border: 32px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: ${rotate} 1.2s infinite;
  }
`;
