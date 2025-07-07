import React from "react";
import { NavLink } from "react-router-dom";
import { Nav, Accordion } from "react-bootstrap";
import logo from "../../assets/images/Tixbook_logo_white-1.svg"
import {
  LayoutDashboard,
  Users,
  UserCog,
  Calendar,
  ClipboardCheck,
  Palette,
  FileText,
  Database,
  LogOut,
  Armchair,
  BookImage,
  UserCheck
} from "lucide-react";

const Sidebar = () => {
  return (
    <div
      className="bg-blue text-white sidebar" 
      style={{ minHeight: "100vh", padding: "2rem" }}
    >
      <div  className="sidebar-header">
        <img  src={logo} alt="logo" class="img-fluid sidebar-logo pb-3" />
        <Nav className="flex-column border-top pt-3 ps-0">
        <Nav.Link
          as={NavLink}
          to="/dashboard"
          className={({ isActive }) =>
            "text-dark" + (isActive ? " active" : "")
          }
        >
           <LayoutDashboard size={18} className="me-2" />
          Dashboard
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/users"
          className={({ isActive }) =>
            "text-dark" + (isActive ? " active" : "")
          }
        >
           <Users size={18} className="me-2" />
          Users
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/admin"
          className={({ isActive }) =>
            "text-dark" + (isActive ? " active" : "")
          }
        >
           <UserCog size={18} className="me-2" /> 
          Admin
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/organizer"
          className={({ isActive }) =>
            "text-dark" + (isActive ? " active" : "")
          }
        >
           <UserCheck size={18} className="me-2" /> 
          Organiser
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/events"
          className={({ isActive }) =>
            "text-dark" + (isActive ? " active" : "")
          }
        >
            <Calendar size={18} className="me-2" />
          Events
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/bookings"
          className={({ isActive }) =>
            "text-dark" + (isActive ? " active" : "")
          }
        >
          <ClipboardCheck size={18} className="me-2" />
          Bookings
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/artists"
          className={({ isActive }) =>
            "text-dark" + (isActive ? " active" : "")
          }
        >
           <Palette size={18} className="me-2" />
          Artists
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/reports"
          className={({ isActive }) =>
            "text-dark" + (isActive ? " active" : "")
          }
        >
           <FileText size={18} className="me-2" />
          Reports
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/media"
          className={({ isActive }) =>
            "text-dark" + (isActive ? " active" : "")
          }
        >
          <BookImage size={18} className="me-2" />
          Media
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/admin/master-data"
          className={({ isActive }) =>
            "text-dark" + (isActive ? " active" : "")
          }
        >
          <Database size={18} className="me-2" />
          Meta Data Management
        </Nav.Link>

         <Nav.Link
          as={NavLink}
          to="/seatmaps"
          className={({ isActive }) =>
            "text-dark" + (isActive ? " active" : "")
          }
          >
             <Armchair size={18} className="me-2"  />
          Seat Maps
        
        </Nav.Link>

        {/* <Accordion defaultActiveKey="">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Master Data Management</Accordion.Header>
            <Accordion.Body className="bg-white p-0">
              <Nav className="flex-column">
                <Nav.Link
                  as={NavLink}
                  to="/master-data/languages"
                  className={({ isActive }) =>
                    "text-dark ps-4" + (isActive ? " active" : "")
                  }
                >
                  Languages
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/master-data/categories"
                  className={({ isActive }) =>
                    "text-dark ps-4" + (isActive ? " active" : "")
                  }
                >
                  Categories
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/master-data/genre"
                  className={({ isActive }) =>
                    "text-dark ps-4" + (isActive ? " active" : "")
                  }
                >
                  Genre
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/master-data/artists"
                  className={({ isActive }) =>
                    "text-dark ps-4" + (isActive ? " active" : "")
                  }
                >
                  Artists
                </Nav.Link>
              </Nav>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion> */}
      </Nav>
        </div>
          <div className="mt-auto border-top pt-4">
        <Nav.Link
          as={NavLink}
          to="/login"
          onClick={() => {
    localStorage.clear();
  }}
          className={({ isActive }) =>
            "text-dark" + (isActive ? " active" : "")
          }
        >
          <LogOut size={18} className="me-2"/>
          Logout
        </Nav.Link>
    </div>
      
    </div>
  );
};

export default Sidebar;
