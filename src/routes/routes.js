import React from 'react';
import { Routes as Switch, Route } from 'react-router-dom';
import Dashboard from '../pages/dashboard';
import Users from '../pages/user';
import Events from '../pages/events';
import Admin from '../pages/admin';
import Organizer from '../pages/organizer';
import MasterData from '../pages/masterData';
import Bookings from '../pages/bookings';
import Reports from '../pages/report';
import MainLayout from '../components/layout/mainlayout';
import SeatingArrangement from '../components/layout/seatingArrangement';
import SeatIndex from '../components/layout/seatIndex';
import RoundTableSeating from '../components/layout/roundTableSeating';
import Artists from '../pages/artists';
import AdminSeatGenerator from '../pages/AdminSeatGenerator';
import SeatAdminPanel from '../pages/SeatAdminPanel';
import SeatMapList from '../pages/SeatMapList';
import AddEventFlow from '../pages/AddEventFlow';
import MediaLibrary from '../components/mediaManager/mediaLibrary';
import MediaUpload from '../components/mediaManager/mediaUpload'
import MediaLibraryManager from '../components/mediaManager/mediaLibraryManager';
import ForgotPassword from '../pages/forgotpassword';
import ForgotPasswordForm from '../components/auth/forgot-password-form';


function ProtectedRoutes() {
  return (
    <Switch>
      {/* For logged-in routes, wrap with MainLayout */}
      <Route 
        path="/dashboard" 
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        } 
      />
       <Route path="forgot-password" element={<ForgotPasswordForm />} />
      <Route 
        path="/users" 
        element={
          <MainLayout>
            <Users />
          </MainLayout>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <MainLayout>
            <Admin />
          </MainLayout>
        } 
      />
      <Route 
        path="/organizer" 
        element={
          <MainLayout>
            <Organizer />
          </MainLayout>
        } 
      />
      <Route 
        path="/events" 
        element={
          <MainLayout>
            <Events />
          </MainLayout>
        } 
      />
      <Route 
        path="/bookings" 
        element={
          <MainLayout>
            <Bookings />
          </MainLayout>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <MainLayout>
            <Reports />
          </MainLayout>
        } 
      />
      <Route 
        path="/artists" 
        element={
          <MainLayout>
            <Artists/>
          </MainLayout>
        } 
      />
      <Route 
        path="/seating" 
        element={
          <MainLayout>
            {/* <SeatingArrangement /> */}
            {/* <SeatLayout /> */}
            <SeatIndex />
          </MainLayout>
        } 
      />
      <Route 
        path="/round-seating" 
        element={
          <MainLayout>
            {/* <SeatingArrangement /> */}
            {/* <SeatLayout /> */}
            <RoundTableSeating />
          </MainLayout>
        } 
      />
      <Route 
       path="admin/master-data"
        element={
          <MainLayout>
            {/* <SeatingArrangement />  */}
             {/* <SeatLayout /> */}
            <MasterData />
          </MainLayout>
        } 
      />
      <Route 
       path="/seatmaps" 
        element={
          <MainLayout>
            <SeatMapList />
          </MainLayout>
        } 
      />
      <Route 
        path="/seating-editor/:id?" 
        element={
          <MainLayout>
            <SeatAdminPanel />
          </MainLayout>
        } 
      />
      <Route path="/events/new" element={
         <MainLayout>
        <AddEventFlow />
        </MainLayout>
        } />
      <Route path="/events/edit/:eventId" element={
        <MainLayout>
        <AddEventFlow />
        </MainLayout>
        } />
      <Route path='/media' element={
        <MainLayout>
          <MediaLibraryManager />
        </MainLayout>
        } />
    </Switch>
  );
}

export default ProtectedRoutes;
