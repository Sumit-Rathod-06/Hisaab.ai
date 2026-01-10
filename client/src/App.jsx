import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";


import Landingpage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashBoardPage from "./pages/DashBoardPage";
import PrivateRoute from "./components/PrivateRoute";
import ExpenseAnalysisPage from "./pages/ExpenseAnalysisPage";
import ProfilePage from "./pages/ProfilePage";
import GoalPage from './pages/GoalPage';
import Alerts from "./pages/AlertsPage.jsx";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<Landingpage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path='dashboard' element={<DashBoardPage/>}/>
        <Route path='goalpage' element={<GoalPage/>}/>
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <DashBoardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="expense_analysis"
          element={
            <PrivateRoute>
              <ExpenseAnalysisPage />
            </PrivateRoute>
          }
        />
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route path="/alerts" element={<Alerts />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
