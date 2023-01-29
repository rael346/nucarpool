import React from "react";
import styled from "styled-components";

const StyledCheckedBox = styled.div`
  background-color: #d0142c;
  border: 2px solid black;
  border-left: 0rem solid;
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

const StyledUncheckedBox = styled.div`
  border: 2px solid black;
  border-left: 0rem solid;
  color: black;
  width: 2.5rem;
  height: 2.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

const DayBox = ({
  day,
  isSelected,
}: {
  day: string;
  isSelected: boolean;
}): React.ReactElement => {
  if (isSelected) {
    return <StyledCheckedBox>{day}</StyledCheckedBox>;
  } else {
    return <StyledUncheckedBox>{day}</StyledUncheckedBox>;
  }
};

export default DayBox;
