import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createTextNode,
  $getRoot,
  type LexicalEditor,
  DecoratorNode,
  type Spread,
  type SerializedLexicalNode,
} from "lexical";
import { useEffect, type JSX } from "react";

interface TokenType {
  name: string;
  regex: RegExp;
  style: string;
  color: string;
}

const Tokens: Array<TokenType> = [
  {
    name: "Object References",
    regex: /#[a-zA-Z0-9]+ $/g,
    style: "color: purple",
    color: "purple",
  },
  {
    name: "User References",
    regex: /@[a-zA-Z0-9]+ $/g,
    style: "color: green",
    color: "green",
  },
  {
    name: "Email references",
    regex: /[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,} $/g,
    style: "color: orange",
    color: "orange",
  },
  {
    name: "Link references",
    regex: /(https:\/\/|http:\/\/)?[a-zA-Z0-9-.]+\.[a-zA-Z]{2,} $/g,
    style: "color: blue",
    color: "blue",
  },
];

function ClickableComponent({
  name,
  color,
  onClick,
}: {
  name: string;
  color: string;
  onClick?: React.EventHandler<React.MouseEvent>;
}) {
  return (
    <span
      style={{
        color,
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {name}
    </span>
  );
}

type SerializedClickableNode = Spread<
  { name: string; color: string },
  SerializedLexicalNode
>;

export class CustomNode extends DecoratorNode<JSX.Element> {
  __name: string;
  __color: string;
  __onClick?: React.EventHandler<React.MouseEvent>;

  static getType(): string {
    return "clickable";
  }
  static clone(_data: CustomNode): CustomNode {
    return new CustomNode(
      _data.__name,
      _data.__color,
      _data.__onClick,
      _data.__key,
    );
  }
  constructor(
    name: string,
    color: string,
    onClick?: React.EventHandler<React.MouseEvent>,
    key?: string,
  ) {
    super(key);
    this.__name = name;
    this.__color = color;
    this.__onClick = onClick;
  }

  createDOM(): HTMLElement {
    return document.createElement("span");
  }
  updateDOM(): boolean {
    return false;
  }
  decorate(): JSX.Element {
    return (
      <ClickableComponent
        onClick={this.__onClick}
        name={this.__name}
        color={this.__color}
      ></ClickableComponent>
    );
  }

  static importJSON(_serializedNode: SerializedClickableNode): CustomNode {
    return new CustomNode(_serializedNode.name, _serializedNode.color);
  }

  exportJSON(): SerializedClickableNode {
    return {
      type: "clickable",
      version: 1,
      name: this.__name,
      color: this.__color,
    };
  }
}

function $createClickableNode(
  name: string,
  color: string,
  onClick: React.EventHandler<React.MouseEvent>,
) {
  return new CustomNode(name, color, onClick);
}

function highlitghtTextNodes(editor: LexicalEditor) {
  editor.update(() => {
    const root = $getRoot();
    const nodes = root.getAllTextNodes();
    for (const node of nodes) {
      if (!node.isSimpleText()) continue;
      const text = node.getTextContent();
      let modified = false;
      for (const token of Tokens) {
        const matches = text.matchAll(token.regex);
        for (const match of matches) {
          const prevNode = $createTextNode(text.slice(0, match.index));
          const newNode = $createClickableNode(
            match[0].toString(),
            token.color,
            () => {
              alert(`Clicked on ${match[0].toString()}`);
            },
          );
          const nextNode = $createTextNode(
            text.slice(match.index + match[0].toString().length),
          );
          node.replace(newNode, false);
          newNode.insertBefore(prevNode, true);
          newNode.insertAfter(nextNode, true);
          modified = true;
          continue;
        }
        if (modified) break;
      }
    }
  });
}

export function KeywordHighlightPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      highlitghtTextNodes(editor);
    });
  }, [editor]);
  return null;
  // <div className="card w-[50%] m-auto flex justify-center items-center shadow-md gap-1 px-3 mb-3 my-2 py-3">
  //     <div className="btn btn-primary w-full">
  //         Action #1
  //     </div>
  //     <div className="btn btn-primary w-full">
  //         Action #2
  //     </div>
  // </div>
}
