import { TodoCard } from "./components/tailwind/TodoCard";

export default function App() {
  return (
    <div className="flex justify-center items-center h-screen">
      <TodoCard
        title="Card title"
        categories={
          {
            "TODO": {
              defaultSelected: true
            },
            "DONE": {},
            "SCHEDULED": {},
            "COMING SOON": {}
          }
        }
        subtasks={
          [
            {
              name: "Card subtask title example #1",
              description: "A simple description",
              category: "TODO",
            },
            {
              name: "Card subtask title example #2",
              category: "DONE"
            },
            {
              name: "Card subtask title example #3",
              category: "SCHEDULED"
            },
            {
              name: "Card subtask title example #4",
              category: "COMING SOON"
            },
          ]
        }></TodoCard>
    </div>
  )
}