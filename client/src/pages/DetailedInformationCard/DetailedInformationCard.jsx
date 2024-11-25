import { useEffect, useState } from 'react';
import { YMaps, Map, FullscreenControl } from '@pbe/react-yandex-maps';
import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  Flex,
  Text,
  Alert,
} from '@chakra-ui/react';
import axiosInstance from '../../axiosInstance';
import { useParams } from 'react-router-dom';
const { VITE_API_STRAIGHT } = import.meta.env;
const { VITE_API_URL } = import.meta.env;
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DetailedInformationCard({ user }) {
  const { routeId } = useParams();
  const [input, setInput] = useState({ review: '', rating: '' });
  const [reviews, setReviews] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [card, setCard] = useState([]);
 const [route, setRoute ] = useState([]);
 const navigate = useNavigate();

 useEffect(() => {
  axiosInstance.get(`/routes`).then((res) => {
    setRoute(res.data);
  });
}, []);


  useEffect(() => {
    axios.get(`${VITE_API_URL}/routes/${routeId}`).then((res) => {
      setCard(res.data);
    });
  }, [routeId]);


  const changeHandler = (el) => {
    const { name, value } = el.target;

    if (name === 'rating') {
      if (value === '' || (value >= 1 && value <= 5)) {
        setInput((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  const submitHandler = async (el) => {
    el.preventDefault();
  
    if (!user?.id) {
      setErrorMessage('Авторизируйтесь для написания отзыва');
      return;
    }
  
    if (!input.review || !input.rating) {
      setErrorMessage('Заполните все поля');
      return;
    }
  
    try {
      const response = await axiosInstance.post(`/rating/${routeId}`, {
        review: input.review,
        rating: input.rating,
        routeId: routeId,
      });
  
      // Включаем данные об авторе отзыва в объект, который добавляем в состояние
      const newReview = {
        ...response.data,
        User: { username: user.username } // Добавляем данные текущего пользователя
      };
  
      // Добавляем новый отзыв в массив отзывов
      setReviews((prev) => [...prev, newReview]);
      setInput({ review: '', rating: '' });
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Ошибка при отправке отзыва. Попробуйте еще раз.');
    }
  };
  
  

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(
          `${VITE_API_STRAIGHT}/rating/${routeId}`
        );
        console.log('Полученные отзывы:', response.data);
        setReviews(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReviews();
  }, [routeId]);

  useEffect(() => {
    const fetchRouteInfo = async () => {
      try {
        const response = await axiosInstance.get(
          `${VITE_API_STRAIGHT}/routes/${routeId}`
        );
        console.log('Полученная информация:', response.data);
        setRouteInfo(response.data); // Устанавливаем информацию о маршруте
      } catch (error) {
        console.log(error);
        setErrorMessage('Ошибка при загрузке информации о маршруте.');
      }
    };
    fetchRouteInfo();
  }, [routeId]);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating(); // Вычисляем средний рейтинг
  

  useEffect(() => {
    if (window.ymaps && card.startPoint && card.endPoint) {
      window.ymaps.ready(function () {
        const myMap = new window.ymaps.Map(`map-${routeId}`, {
          center: card.startPoint || [55.751574, 37.573856], // Координаты по умолчанию
          zoom: 9,
          controls: ['routePanelControl'], // Добавляем панель маршрутизации
        });
  
        const control = myMap.controls.get('routePanelControl');
  
        // Устанавливаем начальную и конечную точки маршрута только если они существуют
        control.routePanel.state.set({
          from: card.startPoint ? card.startPoint.join(",") : "Москва, Льва Толстого 16", // Начальная точка
          to: card.endPoint ? card.endPoint.join(",") : "Москва, Красная площадь",       // Конечная точка
          type: "bicycle", // Тип маршрутизации (можно изменить на "auto" или "pedestrian")
        });
  
        // Настройки панели маршрутизации
        control.routePanel.options.set({
          allowSwitch: false,
          reverseGeocoding: true,
          types: { pedestrian: true, bicycle: true },
        });
      });
    }
  }, [card.startPoint, card.endPoint, routeId]);
  

  const isAccessToDelete = user.id === card.userId;
  const deleteHandler = async () => {
    const response = await axiosInstance.delete(`/routes/${routeId}`);
    if (!isAccessToDelete) {
      return;
    }

    if (response.status === 200) {
      setRoute((prev) => prev.filter((el) => el.id !== routeId));
navigate('/')
    }
  };


  return (
    <VStack spacing={4} align='stretch' height='100vh'> {/* Устанавливаем высоту контейнера на всю высоту страницы */}
  <Flex direction={{ base: 'column', md: 'row' }} spacing={4} height='100%'> {/* Устанавливаем высоту для Flex контейнера */}
    <Box flex='1' p={4} borderWidth={1} borderRadius='md' bg='white'>
      <Heading as='h2' size='lg' mb={4}>
        Информация
      </Heading>
      {routeInfo ? (
        <Box>
          <Text fontWeight='bold'>Название: {routeInfo.title}</Text>
          <Text>Расстояние: {routeInfo.distance} км</Text>
          <Text>Место: {routeInfo.place}</Text>
          <Text>Координаты начала: {routeInfo?.startPoint}</Text>
          <Text>Координаты конца: {routeInfo?.endPoint}</Text>
          <Text>Автор маршрута: {routeInfo.User?.username}</Text>
          <Text fontWeight='bold'>Средний рейтинг: {averageRating}</Text>       
      {isAccessToDelete && <Button onClick={deleteHandler} colorScheme='red' mt='15px'>
           Удалить маршрут
          </Button>}
        </Box>
      ) : (
        <Text>Загрузка информации...</Text>
      )}
      <Box 
        p={4} 
        borderWidth={1} 
        borderRadius='sm' 
        bg='white' 
        width='50vw' 
        mx='auto' 
        marginTop={50}
      >
        <Heading as='h2' size='lg' mb={4}>
          Отзывы
        </Heading>
        {errorMessage && <Alert status='error'>{errorMessage}</Alert>}
        <VStack spacing={4}>
          <Input
            type='text'
            name='review'
            value={input.review}
            onChange={changeHandler}
            placeholder='Отзыв'
          />
          <Input
            type='number'
            name='rating'
            value={input.rating}
            onChange={changeHandler}
            placeholder='Введите число от 1 до 5'
          />
          <Button onClick={submitHandler} colorScheme='teal'>
            Отправить отзыв
          </Button>
   
        </VStack>
  
        <Box mt={4} height='200px' overflowY='auto'> {/* Устанавливаем фиксированную высоту и добавляем прокрутку */}
          {reviews.map((rev, index) => (
            <Box
              key={index}
              borderWidth={1}
              borderRadius='md'
              p={2} // Уменьшаем отступы
              mb={2}
              bg='teal.50'
            >
              <Text fontSize='sm' fontWeight='bold'>{rev.User?.username}</Text>
              <Text fontSize='sm'>{rev.review}</Text>
              <Text fontSize='sm' fontWeight='bold'>Оценка: {rev.rating}</Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
    <Box flex='1' position='relative' height='100vh'> {/* Высота карты на всю высоту страницы */}
      <style> {` .ymaps-2-1-79-route-panel { display: none } `} </style>
      <YMaps>
        <div
          id={`map-${routeId}`}
          style={{
            width: '100%',
            height: '100%', // Задаём высоту 100%
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        ></div>
      </YMaps>
    </Box>
  </Flex>
</VStack>
  );
}
