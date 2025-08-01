// import { TodoCard } from "./components/tailwind/TodoCard";

import { Helmet } from "react-helmet-async";
import TodoList from "./components/tailwind/TodoList";
import "./App.css";
import { useGetCurrentUserQuery } from "./services";
import FeatherIcon from "./components/feather";

export default function App() {
  const currentUser = useGetCurrentUserQuery();
  return (
    <>
      <Helmet>
        <title>YATODA</title>
        <meta name="description" content="Yet Another TOdo Application xD" />
      </Helmet>
      <div className="flex justify-center items-center h-screen">
        {currentUser.isLoading ? (
          <FeatherIcon iconName="loader"></FeatherIcon>
        ) : currentUser.isSuccess ? (
          <TodoList currentUser={currentUser.data.username}></TodoList>
        ) : (
          <>
            An error happened and we couldn't fetch the current user, perhaps
            you may want to authenticate at:{" "}
            <a href={import.meta.env.VITE_BACKEND_URL + "/admin/"}>here</a>
          </>
        )}
      </div>
    </>
  );
}
