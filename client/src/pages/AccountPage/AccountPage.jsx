import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import RouteInputForm from '../../components/RouteInputForm/RouteInputForm';

export default function AccountPage({ user }) {
  const [routes, setRoutes] = useState([]);

  const addRoute = (newRoute) => {
    if (!user || !user.id) {
      console.error('User not found');
      return;
    }

    setRoutes([...routes, { ...newRoute, userId: user.id }]);
  };

  const deleteRoute = (routeId) => {
    setRoutes(routes.filter((route) => route.id !== routeId));
  };

  return (
    <Box p={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center" >
      <h1>Маршруты пользователя {user.username ? user.username : 'Загрузка...'}</h1>
      <RouteInputForm addRoute={addRoute} />

    </Box>
  );
}
