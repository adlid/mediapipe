import "./App.css";
import { NavLink } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <h1>Добрый день уважаемый пользователь!</h1>
      <NavLink className="button" to="/hands">
        Старт
      </NavLink>
    </div>
  );
}

export default App;
