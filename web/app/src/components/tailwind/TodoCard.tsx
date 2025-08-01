import type { Categories, Subtask } from "@/types";
import { useEffect, useState, type ReactNode } from "react";
import Message from "./Message";
import ContextMenu from "./ContextMenu";
import TaskComment from "./TaskComment";

export function TodoCategory(props: {
  id: number | string;
  selected?: boolean;
  children: ReactNode;
  onSelect: (index: number | string, selected: boolean) => void;
}) {
  const [selected, setSelected] = useState(props.selected);
  useEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);
  return (
    <li
      onClick={() => {
        if (props.onSelect) {
          props.onSelect(props.id, !selected);
        } else {
          setSelected(!selected);
        }
      }}
      className={`${selected ? "bg-sky-500 text-white" : ""} hover:bg-sky-300 hover:text-black transition-all py-2 px-3 uppercase cursor-pointer`}
    >
      {props.children}
    </li>
  );
}
export function TodoSubtask(props: { data: Subtask }) {
  const [selected, setSelected] = useState(false);
  const subtaskName = `subtask-${props.data.name}`;
  return (
    <div className="w-full flex flex-col px-5 hover:dark:bg-primary hover:shadow h-15 rounded justify-center transition-all">
      <div className="flex justify-between items-center w-full">
        <label htmlFor={subtaskName} className="cursor-pointer">
          {selected ? (
            // @ts-expect-error This is actually an HTML component and it actually works well
            <strike>{props.data.name}</strike>
          ) : (
            props.data.name
          )}
        </label>
        <input
          className="cursor-pointer"
          checked={selected}
          onChange={(e) => setSelected(e.target.checked)}
          id={subtaskName}
          name={subtaskName}
          type="checkbox"
        ></input>
      </div>
      {props.data.description && (
        <span className="text-gray-300 text-sm px-1">
          {props.data.description}
        </span>
      )}
    </div>
  );
}

export function TodoCard(props: {
  subtasks: Subtask[];
  categories: Categories;
  title: string;
  onClose: () => void;
}) {
  const [selectedCategories, setSelectedCategories] = useState<{
    [id: string]: boolean;
  }>({});
  const [filterBy, setFilterBy] = useState<string>("");
  const [contextMenuEvent, setContextMenuEvent] =
    useState<React.MouseEvent<HTMLDivElement>>();

  useEffect(() => {
    if (Object.keys(selectedCategories).length !== 0) {
      return; // if we had touched already the selectedCategories object then don't need to set the defaults
    }
    for (const cat of Object.keys(props.categories)) {
      if (
        props.categories[cat].defaultSelected &&
        selectedCategories[cat] === undefined
      ) {
        selectedCategories[cat] = props.categories[cat].defaultSelected;
      }
    }
    setSelectedCategories({ ...selectedCategories });
  }, [props.categories, selectedCategories]);

  return (
    <div className="fixed top-0 left-0 w-screen pt-0 h-screen mt-0 z-500">
      <div
        onClick={props.onClose}
        className="w-screen h-screen mt-0 flex justify-center items-center bg-[#e1e6e977] blur-md absolute z-50"
      ></div>
      <div className="w-screen h-screen flex justify-center *:z-100 items-center dark:*:text-white not-dark:*:text-black ">
        <div className="relative flex z-10 gap-1">
          <div
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenuEvent(e);
            }}
            className={`w-[500px] shadow-sm rounded-sm aspect-square px-3 py-5 transition-all hover:shadow-2xl cursor-default 
                        flex flex-col justify-between bg-white dark:bg-gray-700 `}
          >
            <h3 className="font-bold font-serif text-center text-3xl">
              {props.title}
            </h3>
            <div className="divider" />
            <input
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              type="search"
              placeholder="Search"
              className={`
                                w-full rounded border-1 border-blue-200 active:border-blue-300 selection:border-blue-300 inset-shadow-2xl
                                py-1 px-3
                                `}
            ></input>
            <ul className="flex gap-1 my-3 justify-center items-center">
              {Object.keys(props.categories).map((cat, i) => {
                return (
                  <TodoCategory
                    id={cat}
                    selected={selectedCategories[cat]}
                    onSelect={(id, selected) => {
                      selectedCategories[id] = selected;
                      setSelectedCategories({ ...selectedCategories });
                    }}
                    key={i}
                  >
                    {cat}
                  </TodoCategory>
                );
              })}
            </ul>
            <div className="flex flex-col h-full items-center justify-start">
              {props.subtasks
                .filter((subtask) => {
                  return (
                    !!selectedCategories[subtask.category] &&
                    (filterBy.length > 0
                      ? subtask.name.includes(filterBy)
                      : true)
                  );
                })
                .map((subtask, index) => (
                  <TodoSubtask data={subtask} key={index}></TodoSubtask>
                ))}
            </div>
            <TaskComment username="username"></TaskComment>
            <div className="flex justify-end items-center">
              <button className="bg-sky-500 text-white hover:bg-primary rounded-sm w-full px-3 py-1 font-sans shadow hover:shadow-lg transition-all cursor-pointer">
                Add subtask
              </button>
            </div>
            <ContextMenu
              event={contextMenuEvent}
              setEvent={setContextMenuEvent}
            ></ContextMenu>
          </div>
          <div className="flex flex-col justify-start items-center bg-white dark:bg-gray-700 shadow-md hover:shadow-2xl transition-shadow  rounded w-80 py-3 px-1">
            <h3 className="cursor-default">Sidebar</h3>
            <div className="divider" />
            <Message
              username="username"
              createdAt={new Date().toDateString()}
              message="message"
              onSelect={(selected) => {
                console.log("selected: ", selected);
              }}
            ></Message>
          </div>
        </div>
      </div>
    </div>
  );
}
