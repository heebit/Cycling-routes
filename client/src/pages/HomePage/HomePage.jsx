import axios from "axios";
import React, { useEffect, useState } from "react";
import CardRoute from "../../components/Card/CardRoute";
const { VITE_API_URL } = import.meta.env;
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [card, setCard] = useState([]);

  useEffect(() => {
    axios.get(`${VITE_API_URL}/routes`).then((res) => {
      setCard(res.data);
    });
  }, []);
  return (
    <div className={styles.all}>
      <div className={styles.route}>Все маршруты</div>
      <div className={styles.container}>
        {card.map((el) => {
          return (
            <CardRoute
              key={el.id}
            
              title={el.title}
              distance={el.distance}
              place={el.place}
              routeId = {el.id}   
              startPoint ={el.startPoint}
              endPoint = {el.endPoint}
              averageRating={el.averageRating}
            />
          );
        })}
      </div>
    </div>
  );
}
