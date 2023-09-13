import { NavLink } from "react-router-dom";

export const MainPage = () => {
  return (
    <>
      <h1>Добрый день уважаемый пользователь!</h1>
      <NavLink className="button" to="/camera">
        Старт
      </NavLink>
    </>
  );
};
