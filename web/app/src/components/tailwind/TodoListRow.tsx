import type { TodoEl } from "@/types";
import { useState } from "react";
import { TodoCard } from "./TodoCard";

export default function TodoListRow(
  props: TodoEl & {
    onCopy: (name: string) => void;
    onDelete: () => void;
  },
) {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <div className=" dark:bg-white dark:text-black flex shadow-md p-3 hover:shadow-lg hover:scale-101 mx-3 transition-all rounded justify-between cursor-default">
        <div className="flex flex-col">
          <span className="text-bold text-lg">{props.name}</span>
          <span className="ml-1 text-xs text-gray-500">{props.date}</span>
          <span className="ml-1 text-sm text-gray-500">@{props.owner}</span>
        </div>
        <div className="flex items-center gap-1 text-sm *:uppercase">
          <button
            onClick={() => props.onCopy(props.name)}
            className="hover:bg-blue-400 transition-colors bg-blue-300 py-1 px-3 h-fit rounded cursor-pointer"
          >
            Copy
          </button>
          <button
            onClick={() => setEditing(true)}
            className="hover:bg-sky-400 transition-colors bg-sky-300 py-1 px-3 h-fit rounded cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => props.onDelete()}
            className="hover:bg-red-800 transition-colors bg-red-500 py-1 px-3 h-fit rounded text-amber-50 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
      {editing && (
        <TodoCard
          onClose={() => setEditing(false)}
          title={props.name}
          categories={{
            TODO: {
              defaultSelected: true,
            },
            DONE: {},
            SCHEDULED: {},
            "COMING SOON": {},
          }}
          subtasks={[
            {
              name: "Card subtask title example #1",
              description: "A simple description",
              category: "TODO",
            },
            {
              name: "Card subtask title example #2",
              category: "DONE",
            },
            {
              name: "Card subtask title example #3",
              category: "SCHEDULED",
            },
            {
              name: "Card subtask title example #4",
              category: "COMING SOON",
            },
          ]}
        ></TodoCard>
      )}
    </>
  );
}
