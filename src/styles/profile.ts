import styled from "styled-components";

export const CompleteProfileButton = styled.button`
  background: #b12424;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  text-align: center;
  color: #ffffff;
  width: 222px;
  align-self: flex-end;
  justify-self: flex-end;
`;

export const ProfileContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 85%;
  align-items: center;
  padding: 2rem 1.5rem;
`;

export const ProfileColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 80%;
  width: 50%;
`;

export const TopProfileSection = styled(ProfileColumn)`
  height: 30%;
  width: 100%;
`;
export const MiddleProfileSection = styled(ProfileColumn)`
  height: 60%;
  width: 100%;
`;

export const BottomProfileSection = styled(ProfileColumn)`
  height: 10%;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ProfileHeader = styled.h1`
  display: flex;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 38px;
  color: #000000;
`;
