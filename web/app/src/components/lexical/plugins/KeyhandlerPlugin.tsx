import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_HIGH, KEY_ENTER_COMMAND } from "lexical";
import { useEffect, type JSX } from "react";

export function EnterKeyHandlerPlugin(props: {
  onSubmit: (e: KeyboardEvent) => void;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (event && !event.shiftKey) {
          event?.preventDefault();
          console.log("submit triggered");
          props.onSubmit(event);
          return true; // this stop Lexical default behavior
        } else {
          return false;
        }
      },
      COMMAND_PRIORITY_HIGH,
    );
  }, [editor, props]);
  return null;
}
