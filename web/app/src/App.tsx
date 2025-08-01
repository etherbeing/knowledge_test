// import { TodoCard } from "./components/tailwind/TodoCard";

import { Helmet } from "react-helmet-async";
import TodoList from "./components/tailwind/TodoList";
import "./App.css";

export default function App() {
  return (
    <>
      <Helmet>
        <title>YATODA</title>
        <meta name="description" content="Yet Another TOdo Application xD" />
      </Helmet>
      <div className="flex justify-center items-center h-screen">
        <TodoList currentUser={"username"}></TodoList>
      </div>
    </>
  );
}
