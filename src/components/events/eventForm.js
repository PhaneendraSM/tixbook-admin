import React, { useEffect, useState } from 'react';
import DynamicForm from '../../components/common/form';
import { Spinner } from 'react-bootstrap';
import * as categoryService from '../../services/categoryService';
import * as genreService from '../../services/genreService';
import * as languageService from '../../services/languageService';
import * as artistService from '../../services/artistService';

const EventForm = ({ initialData, onSubmit, onCancel }) => {
  const [options, setOptions] = useState({
    language: [],
    genre: [],
    category: [],
    artist: [],
    pricing: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoading(true);
        const [langRes, genreRes, categoryRes, artistRes] = await Promise.all([
          languageService.list(),
          genreService.list(),
          categoryService.list(),
          artistService.list(),
         // getPricingOptions(),
        ]);

        
console.log("Artist response:", artistRes);

        setOptions({
           language: langRes.data.map(item => ({ value: item._id, label: item.name })),
      genre: genreRes.data.map(item => ({ value: item._id, label: item.name })),
      category: categoryRes.data.map(item => ({ value: item._id, label: item.name })),
      artist: artistRes.data.map(item => ({ value: item._id, label: item.name })),
        //  pricing: pricingRes.data.map(item => ({ value: item._id, label: `₹${item.price} - ${item.description}` })),
        });
      } catch (error) {
        console.error("Failed to fetch form options", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const fields = [
    { name: 'title', label: 'Title', type: 'text', placeholder: 'Enter event title', required: true },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter event description', required: true },
    { name: 'date', label: 'Date', type: 'date', required: true },
     { name: 'duration', label: 'Duration', type: 'text', placeholder: 'Enter duration', required: true },
    { name: 'time', label: 'Time', type: 'time', placeholder: 'Enter time', required: true },
    { name: 'venue', label: 'Venue', type: 'text', placeholder: 'Enter venue', required: true },
    { name: 'address', label: 'Address', type: 'text', placeholder: 'Enter address', required: true },
    { name: 'city', label: 'City', type: 'text', placeholder: 'Enter city', required: true },
    { name: 'map', label: 'Map', type: 'text', placeholder: 'Enter map Link', required: true },
    {
  name: 'category',
  label: 'Category',
  type: 'select',
  options: [{ value: '', label: 'Select Category' }, ...options.category],
  required: true
},
   {
  name: 'genre',
  label: 'Genre',
  type: 'select',
  options: [{ value: '', label: 'Select Genre' }, ...options.genre],
  required: true
},
{
  name: 'language',
  label: 'Language',
  type: 'select',
  options: [{ value: '', label: 'Select Language' }, ...options.language],
  required: true
},
{
  name: 'artist',
  label: 'Artist',
  type: 'select',
  options: [{ value: '', label: 'Select Artist' }, ...options.artist],
  required: true
},
    { name: 'ageGroup', label: 'Age Group', type: 'text', placeholder: 'Enter age group', required: true },

    { name: 'pet', label: 'Pet Friendly', type: 'radio', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }], required: true },
   
    // {
    //   name: 'pricing', label: 'Pricing', type: 'select', options: options.pricing, required: false
    // },
    // {
    //   name: 'layout', label: 'Layout', type: 'select', options: [
    //     { value: 'indoor', label: 'Indoor' },
    //     { value: 'outdoor', label: 'Outdoor' }
    //   ], required: true
    // },
  ];

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" className="mb-3">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <h5>Loading form options...</h5>
        <p className="text-muted">Please wait while we load event details</p>
      </div>
    );
  }

  return (
    <DynamicForm
      fields={fields}
      initialValues={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitText="Next"
      cancelText="Cancel"
    />
  );
};

export default EventForm;
