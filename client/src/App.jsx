import './App.css';
import Root from './Root';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SigninPage from './pages/SigninPage/SigninPage';
import SignupPage from './pages/SignupPage/SignupPage';
import { useState } from 'react';
import { useEffect } from 'react';
import axiosInstance, { setAccessToken } from './axiosInstance';
import AccountPage from './pages/AccountPage/AccountPage';
import HomePage from './pages/HomePage/HomePage';
import DetailedInformationCard from './pages/DetailedInformationCard/DetailedInformationCard';

function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    axiosInstance.get(`/tokens/refresh`).then((res) => {
      setUser(res.data.user);
      setAccessToken(res.data.accessToken);
    });
  }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root user={user} setUser={setUser} />,
      children: [
        {
          path: '/',
          element: <HomePage setUser={setUser} />,
        },        
        {
          path: '/account',
          element: <AccountPage user={user} setUser={setUser} />,
        },
        {
          path: '/signin',
          element: <SigninPage setUser={setUser} />,
        },
        {
          path: '/signup',
          element: <SignupPage setUser={setUser} />,
        },
        {
          path: '/DetailedInformationCard/:routeId',
          element: <DetailedInformationCard user={user} />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
