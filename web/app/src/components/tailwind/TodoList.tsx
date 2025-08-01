import type { TodoEl } from "@/types";
import TodoHeader from "./TodoHeader";
import TodoListRow from "./TodoListRow";
import { useCallback, useRef, useState } from "react";
import Editor from "../lexical";
import { useSnackbar } from "notistack";

const TodoEls: TodoEl[] = [
  {
    name: "Task name #1",
    owner: "username",
    date: new Date().toDateString(),
  },
  {
    name: "Task name #2",
    owner: "username",
    date: new Date().toDateString(),
  },
  {
    name: "Task name #3",
    owner: "username",
    date: new Date().toDateString(),
  },
];

export default function TodoList(props: { currentUser: string }) {
  const [elements, setElements] = useState(TodoEls);
  const snackbar = useSnackbar();
  // @ts-expect-error TOOD
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [newValue, setNewValue] = useState("");
  const newInputRef = useRef<HTMLDivElement>(null);
  const createTask = useCallback(
    (args?: { name: string }) => {
      if (!newInputRef.current) return;
      const newName = args?.name || newInputRef.current.textContent;
      if (!newName) {
        snackbar.enqueueSnackbar({
          message: "Please fill up a name for your task",
          variant: "error",
        });
        return;
      }
      setElements([
        ...elements,
        {
          name: newName,
          owner: props.currentUser,
          date: new Date().toDateString(),
        },
      ]);
      setNewValue("");
    },
    [elements, props.currentUser, snackbar],
  );
  const deleteTask = useCallback(
    (index: number) => {
      elements.splice(index, 1);
      setElements([...elements]);
    },
    [elements],
  );
  return (
    <section className="h-full w-full">
      <TodoHeader></TodoHeader>
      <div className="flex flex-col gap-3 mt-3">
        {elements.map((element, i) => {
          return (
            <TodoListRow
              key={i}
              onDelete={() => deleteTask(i)}
              onCopy={(name) => createTask({ name: name })}
              name={element.name}
              owner={element.owner}
              date={element.date}
            ></TodoListRow>
          );
        })}
        <div className="relative flex flex-col items-center justify-center">
          <Editor
            onSubmit={() => {
              if (newInputRef.current && newInputRef.current.textContent)
                createTask({ name: newInputRef.current.textContent });
              snackbar.enqueueSnackbar({
                message: "Invalid name given",
                variant: "error",
              });
            }}
            inputRef={newInputRef}
            placeholder="Type to create a new task"
          ></Editor>
          {/* <input ref={newInputRef} value={newValue} onChange={(e) => {
                        setNewValue(e.target.value)
                    }} onKeyDown={(e) => e.code === "Enter" && createTask()} className="rounded py-3 px-3 mt-3 mx-1 w-full" placeholder="Type to create a new task"></input>
                    <div className="absolute right-0 top-0 w-20 flex justify-center items-center h-full">
                        <button onClick={() => createTask()} className="mt-3 rounded-full bg-sky-500 hover:bg-sky-700 cursor-pointer transition-all shadow-lg hover:shadow-xl  w-10 h-10 text-lg font-extrabold">+</button>
                    </div> */}
        </div>
      </div>
    </section>
  );
}
