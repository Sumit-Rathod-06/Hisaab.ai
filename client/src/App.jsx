import { useState } from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import Landingpage from './pages/LandingPage';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" >
        <Route index element={<Landingpage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
