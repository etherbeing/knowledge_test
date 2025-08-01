/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import FeatherIcon from "@/components/feather";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";

function Divider() {
  return <div className="divider" />;
}

export type ActionState = "x" | "plus" | "save";

export default function ToolbarPlugin({
  actionState = "plus",
}: {
  actionState: ActionState;
}) {
  const [editor] = useLexicalComposerContext();
  const [action] = useState(actionState);
  const [value, setValue] = useState("");

  const toolbarRef = useRef(null);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setValue(editor.getRootElement()?.textContent || "");
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateToolbar]);

  return (
    <div className="toolbar flex justify-between" ref={toolbarRef}>
      <div className="flex">
        <button className="toolbar-item flex justify-items-center gap-1 text-gray-500">
          <FeatherIcon iconName="maximize-2"></FeatherIcon>
          <span className="custom-xl-hidden">Open</span>
        </button>
        <button className="toolbar-item flex justify-items-center gap-1 text-gray-500">
          <FeatherIcon iconName="calendar"></FeatherIcon>
          <span className="custom-xl-hidden">Today</span>
        </button>
        <button className="toolbar-item flex justify-items-center gap-1 text-gray-500">
          <FeatherIcon iconName="unlock"></FeatherIcon>
          <span className="custom-xl-hidden">Public</span>
        </button>
        <button className="toolbar-item flex justify-items-center gap-1 text-gray-500">
          <FeatherIcon iconName="loader"></FeatherIcon>
          <span className="custom-xl-hidden">Normal</span>
        </button>
        <button className="toolbar-item flex justify-items-center gap-1 text-gray-500">
          <FeatherIcon iconName="circle"></FeatherIcon>
          <span className="custom-xl-hidden">Estimation</span>
        </button>
        <button className="toolbar-item flex justify-items-center gap-1 text-gray-500">
          <FeatherIcon iconName="trash-2"></FeatherIcon>
          <span className="custom-xl-hidden">Delete</span>
        </button>
        <Divider></Divider>
      </div>
      <button
        className={`btn btn-primary btn-square ${value.length > 0 ? "custom-x-transition" : ""}`}
      >
        <FeatherIcon iconName={action}></FeatherIcon>
      </button>
    </div>
  );
}
