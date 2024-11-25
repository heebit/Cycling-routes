import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormErrorMessage,
} from '@chakra-ui/react';
import axiosInstance from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function RouteInputForm({ addRoute }) {
  const [routeTitle, setRouteTitle] = useState('');
  const [distance, setDistance] = useState('');
  const [place, setPlace] = useState('');
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (window.ymaps) {
      window.ymaps.ready(function () {
        const myMap = new window.ymaps.Map('map', {
          center: [55.753994, 37.622093],
          zoom: 9,
          controls: ['routePanelControl'],
        });

        const control = myMap.controls.get('routePanelControl');

        control.routePanel.options.set({
          allowSwitch: false,
          reverseGeocoding: false,
          types: {
            bicycle: true,
          },
        });

        const switchPointsButton = new window.ymaps.control.Button({
          data: {
            content: 'Поменять местами',
            title: 'Поменять точки местами',
          },
          options: { selectOnClick: false, maxWidth: 160 },
        });

        switchPointsButton.events.add('click', function () {
          control.routePanel.switchPoints();
        });

        myMap.controls.add(switchPointsButton);
      });
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!routeTitle) {
      newErrors.routeTitle = 'Название маршрута обязательно';
    }
    if (!distance) {
      newErrors.distance = 'Дистанция маршрута обязательна';
    }
    if (!place) {
      newErrors.place = 'Место маршрута обязательно';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const testInput = document.querySelectorAll(
      '.ymaps-2-1-79-route-panel-input__input'
    );

    let localStartCoords = null;
    let localEndCoords = null;

    testInput.forEach((el) => {
      if (el.placeholder === 'Откуда') {
        localStartCoords = el.value.split(',').map((coord) => parseFloat(coord.trim()));
      }
      if (el.placeholder === 'Куда') {
        localEndCoords = el.value.split(',').map((coord) => parseFloat(coord.trim()));
      }
    });

    if (!localStartCoords || !localEndCoords) {
      alert('Пожалуйста, выберите начальную и конечную точки.');
      return;
    }

    const newRoute = {
      title: routeTitle,
      distance: Number(distance),
      place: place,
      startPoint: localStartCoords,
      endPoint: localEndCoords,
    };

    try {
      const response = await axiosInstance.post('/routes', newRoute);
      addRoute(response.data);
      setRouteTitle('');
      setDistance('');
      setPlace('');
      setStartCoords(null);
      setEndCoords(null);
      const route = response.data;
      navigate(`/DetailedInformationCard/${route.id}`);
    } catch (error) {
      console.error('Ошибка при создании маршрута', error);
    }
  };

  return (
    <Box border="1px" borderRadius="md" p={4} width={['100%', '80%', '60%']} maxWidth="800px" backgroundColor="white" boxShadow="md" mx="auto">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>

          <FormControl isInvalid={errors.routeTitle}>
            <FormLabel>Название маршрута</FormLabel>
            <Input
              value={routeTitle}
              onChange={(e) => setRouteTitle(e.target.value)}
              placeholder="Введите название маршрута"
            />
            <FormErrorMessage>{errors.routeTitle}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.distance}>
            <FormLabel>Дистанция маршрута (км)</FormLabel>
            <Input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="Введите дистанцию маршрута"
            />
            <FormErrorMessage>{errors.distance}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.place}>
            <FormLabel>Место (населенный пункт)</FormLabel>
            <Input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="Введите населенный пункт"
            />
            <FormErrorMessage>{errors.place}</FormErrorMessage>
          </FormControl>

          <Box id="map" width="100%" height="300px" />

          <Button type="submit" colorScheme="teal">
            Создать маршрут
          </Button>
          
        </VStack>
      </form>
    </Box>
  );
}
