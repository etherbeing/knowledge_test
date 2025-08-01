import { useState, useRef } from "react";
import RichTextCompletePane from "./RichTextCompletePane";

export default function RichTextEditor() {
  // we could use a lib here but as the actual purpose of this project is to showcase my knowledge lets go with this
  const [filteringQuery, setFilteringQuery] = useState<string>("");
  const [filteringObjects, setFilteringObjects] = useState(false);
  const [filteringUsers, setFilteringUsers] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [paneSelected, setPaneSelected] = useState<number>(0);
  const [value, setValue] = useState<string>("");
  const objects = ["1", "2"];
  const users = ["user 1", "user 2"];

  return (
    <div className="w-full flex flex-col relative">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => {
          const lastToken = e.target.value[e.target.value.length - 1] || "";
          if (lastToken === "#" && !filteringObjects) {
            setFilteringObjects(true);
          } else if (lastToken === "@" && !filteringUsers) {
            setFilteringUsers(true);
          } else if (lastToken.trim().length === 0) {
            // if is a whitespace or ln
            setFilteringObjects(false);
            setFilteringUsers(false);
            setFilteringQuery("");
          } else if (filteringObjects) {
            setFilteringQuery(e.target.value.split("#").pop() || "");
          } else if (filteringUsers) {
            setFilteringQuery(e.target.value.split("@").pop() || "");
          }
          setValue(e.target.value);
        }}
        onKeyDown={(e) => {
          if (filteringObjects || filteringUsers) {
            switch (e.code) {
              case "Tab":
                e.preventDefault();
                if (e.shiftKey) {
                  setPaneSelected(Math.max(paneSelected - 1, 0));
                } else {
                  setPaneSelected(
                    Math.min(
                      paneSelected + 1,
                      (filteringObjects ? objects.length : users.length) - 1,
                    ),
                  );
                }
                break;
              case "ArrowDown":
                e.preventDefault();
                setPaneSelected(
                  Math.min(
                    paneSelected + 1,
                    (filteringObjects ? objects.length : users.length) - 1,
                  ),
                );
                break;
              case "ArrowUp":
                e.preventDefault();
                setPaneSelected(Math.max(paneSelected - 1, 0));
                break;
              case "Enter":
                e.preventDefault();
                if (filteringUsers) {
                  setValue(
                    value.slice(0, value.lastIndexOf("@") + 1) +
                      users[paneSelected],
                  );
                  setFilteringUsers(false);
                } else if (filteringObjects) {
                  setValue(
                    value.slice(0, value.lastIndexOf("#") + 1) +
                      objects[paneSelected],
                  );
                  setFilteringObjects(false);
                }
                break;
              default:
                return;
            }
          }
        }}
        id="comment"
        name="comment"
        placeholder="Comment on this task"
        className="rounded border-1 border-blue-200 active:border-blue-300 selection:border-blue-300 inset-shadow-2xl py-1 px-3"
      ></input>
      {filteringObjects ? (
        <RichTextCompletePane
          selected={paneSelected}
          query={filteringQuery}
          inputRef={inputRef}
          elements={objects}
        ></RichTextCompletePane>
      ) : filteringUsers ? (
        <RichTextCompletePane
          selected={paneSelected}
          query={filteringQuery}
          inputRef={inputRef}
          elements={users}
        ></RichTextCompletePane>
      ) : null}
    </div>
  );
}
