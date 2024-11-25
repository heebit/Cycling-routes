import React, { useState, useEffect } from "react";
import { Card, CardBody, Stack, Text, Divider } from "@chakra-ui/react"; // или используйте ваш вариант компонентов карточек
import { Link } from "react-router-dom";
import { YMaps, Map, FullscreenControl } from "@pbe/react-yandex-maps"; // Убедитесь, что у вас установлен этот пакет
import styles from "./CardRoute.module.css"; // Проверьте путь к вашим стилям
const { VITE_API_STRAIGHT } = import.meta.env;

export default function CardRoute({
  title,
  distance,
  place,
  routeId,
  startPoint,
  endPoint,
}) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Функция загрузки отзывов
    const fetchReviews = async () => {
      try {
        const response = await fetch(` ${VITE_API_STRAIGHT}/rating/${routeId}`); // замените на ваш API путь
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Ошибка загрузки отзывов:", error);
      }
    };

    fetchReviews();

    if (window.ymaps) {
      window.ymaps.ready(function () {
        const myMap = new window.ymaps.Map(`map-${routeId}`, {
          center: startPoint || [55.751574, 37.573856],
          zoom: 9,
          controls: ["routePanelControl"],
        });

        const control = myMap.controls.get("routePanelControl");
        control.routePanel.state.set({
          from: startPoint ? startPoint.join(",") : "Москва, Льва Толстого 16",
          to: endPoint ? endPoint.join(",") : "Москва, Красная площадь",
          type: "bicycle",
        });

        control.routePanel.options.set({
          allowSwitch: false,
          reverseGeocoding: true,
          types: { pedestrian: true, bicycle: true },
        });
      });
    }
  }, [startPoint, endPoint, routeId]);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

  return (
    <div className={styles.cardContainer}>
      <style> {` .ymaps-2-1-79-route-panel { display: none } `} </style>
      <Card maxW="sm" borderRadius={"10px"}>
        <YMaps>
          <div
            id={`map-${routeId}`}
            style={{
              width: "100%",
              height: "350px",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          ></div>
        </YMaps>
        <Link to={`/DetailedInformationCard/${routeId}`}>
          <CardBody>
            <Stack mt="6" spacing="3">
              <Text className={styles.title}>
                {title.length > 24 ? `${title.substring(0, 24)}...` : title}
              </Text>
              <Text className={styles.place}>📍 {place}</Text>
              <Text className={styles.distance}> 📏 {distance} км</Text>
              <Text className={styles.rating}>
                ★ Средний рейтинг: {averageRating}
              </Text>{" "}
            </Stack>
          </CardBody>
          <Divider />
        </Link>
      </Card>
    </div>
  );
}
