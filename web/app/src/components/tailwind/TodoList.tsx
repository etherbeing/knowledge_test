import TodoHeader from "./TodoHeader";
import TodoListRow from "./TodoListRow";
import { useCallback, useRef, useState } from "react";
import Editor from "../lexical";
import { useSnackbar } from "notistack";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation,
} from "@/services";
import FeatherIcon from "../feather";
import type { UserT } from "@/services/types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function TodoList(_props: { currentUser: string }) {
  const tasks = useGetTasksQuery();
  const [apiCreateTask] = useCreateTaskMutation();
  // @ts-expect-error asd
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [apiUpdateTask] = useUpdateTaskMutation();
  const [apiDeleteTask] = useDeleteTaskMutation();
  const snackbar = useSnackbar();
  const [newValue, setNewValue] = useState("");
  const newInputRef = useRef<HTMLDivElement>(null);
  const createTask = useCallback(
    async (args?: { name: string }) => {
      if (!newInputRef.current) return;
      const newName = args?.name || newInputRef.current.textContent;
      if (!newName) {
        snackbar.enqueueSnackbar({
          message: "Please fill up a name for your task",
          variant: "error",
        });
        return;
      }
      await apiCreateTask({
        title: newName,
        category: {
          title: "TODO",
        },
      });
      await tasks.refetch();
      setNewValue("");
    },
    [apiCreateTask, snackbar, tasks],
  );
  const deleteTask = useCallback(
    async (index: number) => {
      await apiDeleteTask({ id: index });
      await tasks.refetch();
    },
    [apiDeleteTask, tasks],
  );
  return tasks.isLoading ? (
    <FeatherIcon iconName="loader"></FeatherIcon>
  ) : (
    tasks.isSuccess && (
      <section className="h-full w-full">
        <TodoHeader></TodoHeader>
        <div className="flex flex-col gap-3 mt-3">
          {tasks.data.map((task, i) => {
            return (
              <TodoListRow
                key={i}
                onDelete={() => deleteTask(task.id as number)}
                onCopy={(name) => createTask({ name: name })}
                name={task.title}
                owner={task.owner as UserT}
                date={task.created_at as string}
              ></TodoListRow>
            );
          })}
          <div className="relative flex flex-col items-center justify-center">
            <Editor
              linkSetValue={setNewValue}
              linkedValue={newValue}
              onSubmit={async () => {
                if (newInputRef.current && newInputRef.current.textContent) {
                  await createTask({ name: newInputRef.current.textContent });
                } else {
                  snackbar.enqueueSnackbar({
                    message: "Invalid name given",
                    variant: "error",
                  });
                }
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
    )
  );
}
