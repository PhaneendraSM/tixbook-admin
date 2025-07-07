// src/pages/admin/MasterData.jsx
import React from 'react';
import { Container, Tab, Nav } from 'react-bootstrap';
import CrudManager from '../components/admin/crudManager';
import * as categoryService from '../services/categoryService';
import * as genreService    from '../services/genreService';
import * as languageService from '../services/languageService';
import * as artistService   from '../services/artistService';
import * as pricingService  from '../services/pricingService';

const MasterData = () => {
  const configs = [
    {
      title: 'Categories',
      service: categoryService,
      columns: [{ key: 'name', label: 'Name' }],
      formFields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        // { name: 'description', label: 'Description', type: 'text' }
      ]
    },
    {
      title: 'Genres',
      service: genreService,
      columns: [{ key: 'name', label: 'Name' }],
      formFields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        // { name: 'description', label: 'Description', type: 'text' }
      ]
    },
    {
      title: 'Languages',
      service: languageService,
      columns: [{ key: 'name', label: 'Name' }],
      formFields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text', required: true }
      ]
    },
    {
      title: 'Artists',
      service: artistService,
      columns: [{ key: 'name', label: 'Name' }],
      formFields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'bio', label: 'Bio', type: 'text', required: true }
      ]
    },
    {
      title: 'Pricing',
      service: pricingService,
      columns: [{ key: 'name', label: 'Name' }],
      formFields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'price', label: 'Price', type: 'text', required: true }
      ]
    }
  ];


  return (
    <Container fluid className="mt-4">
      <h3>Master Data Management</h3>
      <Tab.Container defaultActiveKey={configs[0].title}>
        <Nav variant="tabs">
          {configs.map(c => (
            <Nav.Item key={c.title}>
              <Nav.Link eventKey={c.title}>{c.title}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
        <Tab.Content className="mt-3">
          {configs.map(c => (
            <Tab.Pane eventKey={c.title} key={c.title}>
              <CrudManager 
                title={c.title} 
                service={c.service} 
                columns={c.columns} 
                formFields={c.formFields} 
              />
            </Tab.Pane>
          ))}
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default MasterData;
