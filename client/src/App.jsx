import { useState } from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import Landingpage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashBoardPage from './pages/DashBoardPage';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" >
        <Route index element={<Landingpage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path='dashboard' element={<PrivateRoute><DashBoardPage/></PrivateRoute>}/>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
