// src/components/layout/Header.js
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import profile from '../../assets/images/profile-icon.svg';

const user = JSON.parse(localStorage.getItem('user'));
console.log(user);

const Header = () => {
  return (
    <Navbar bg="light" variant="light" expand="lg" className="ps-4 top-bar" >
      <Navbar.Brand as={Link} to="/dashboard">Admin Panel</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto d-flex align-items-center">
          {/* <Nav.Link as={Link} to="/profile"> */}
          <p className='me-2 mb-0'>{user.username}</p>
          <img src={profile} alt="profileicon" className='img-fluid'/>
          {/* </Nav.Link> */}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
