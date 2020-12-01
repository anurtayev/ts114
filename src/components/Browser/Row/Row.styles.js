import styled from "styled-components";
import { ReactComponent as UnstyledEditIcon } from "./edit.svg";
import { ReactComponent as UnstyledCopyIcon } from "./copy.svg";
import { ReactComponent as UnstyledDeleteIcon } from "./delete.svg";

export const Container = styled.div`
  background: ${(props) => props.theme.primaryColor};
  display: flex;
  background: ${(props) =>
    props.isEvenRow ? "aquamarine" : props.theme.primaryColor};
`;

export const StyledSpan = styled.span`
  margin: 0.3em 1em 0.7em 0;
  width: ${(props) => props.width};
`;

const svgIconsStyle = `
margin: 0.4em 1em 0.6em 0;
`;
export const EditIcon = styled(UnstyledEditIcon)([svgIconsStyle]);
export const DeleteIcon = styled(UnstyledDeleteIcon)([svgIconsStyle]);
export const CopyIcon = styled(UnstyledCopyIcon)([svgIconsStyle]);
