import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  gap: 2rem;
  width: 100%;
  background: #004d00;
  padding: 1rem 2rem;
  display: flex;
  justify-content:center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

`;

const StyledLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  font-weight: 600;

  &.active {
    text-decoration: underline;
  }
`;

export default function Header(){ 
  return (
  <Nav>
    <StyledLink to="/" end>Home</StyledLink>
    <StyledLink to="/animals">Animals</StyledLink>
  </Nav>
);
}

