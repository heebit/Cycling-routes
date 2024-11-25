import axiosInstance, { setAccessToken } from "../../axiosInstance";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import tour from "../../../public/tour.png";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const logoutHandler = async () => {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_API_URL}/auth/signout`
    );
    if (response.status === 200) {
      setUser({});
      setAccessToken("");
      navigate("/");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <Link to="/">
          <img src={tour} className={styles.img} />
        </Link>
      </div>
      <div className={styles.right}>
        {user?.email ? (
          <>
            <Link to='/account'>Создать маршрут</Link>
            <Link onClick={logoutHandler}>Выйти</Link>
          </>
        ) : (
          <>
            <Link to="/signin">Войти</Link>
            <Link to="/signup">Регистрация</Link>
          </>
        )}
      </div>
    </div>
  );
}
