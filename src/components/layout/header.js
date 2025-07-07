// src/components/layout/Header.js
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import profile from '../../assets/images/profile-icon.svg';

const Header = () => {
  return (
    <Navbar bg="light" variant="light" expand="lg" className="ps-4 top-bar" >
      <Navbar.Brand as={Link} to="/dashboard">Admin Panel</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/profile">
          <img src={profile} alt="profileicon" className='img-fluid'/>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
