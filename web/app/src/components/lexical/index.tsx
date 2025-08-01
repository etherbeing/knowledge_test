/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import "./styles.css";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import {
  $isTextNode,
  type DOMConversionMap,
  type DOMExportOutput,
  type DOMExportOutputMap,
  isHTMLElement,
  type Klass,
  type LexicalEditor,
  type LexicalNode,
  ParagraphNode,
  TextNode,
} from "lexical";

import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { parseAllowedColor, parseAllowedFontSize } from "./styleConfig";
import FeatherIcon from "../feather";
import {
  CustomNode,
  KeywordHighlightPlugin,
} from "./plugins/KeywordsHighlightingPlugin";
import type { RefObject } from "react";
import { EnterKeyHandlerPlugin } from "./plugins/KeyhandlerPlugin";

const removeStylesExportDOM = (
  editor: LexicalEditor,
  target: LexicalNode,
): DOMExportOutput => {
  const output = target.exportDOM(editor);
  if (output && isHTMLElement(output.element)) {
    // Remove all inline styles and classes if the element is an HTMLElement
    // Children are checked as well since TextNode can be nested
    // in i, b, and strong tags.
    for (const el of [
      output.element,
      ...output.element.querySelectorAll('[style],[class],[dir="ltr"]'),
    ]) {
      el.removeAttribute("class");
      el.removeAttribute("style");
      if (el.getAttribute("dir") === "ltr") {
        el.removeAttribute("dir");
      }
    }
  }
  return output;
};

const exportMap: DOMExportOutputMap = new Map<
  Klass<LexicalNode>,
  (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
  [ParagraphNode, removeStylesExportDOM],
  [TextNode, removeStylesExportDOM],
]);

const getExtraStyles = (element: HTMLElement): string => {
  // Parse styles from pasted input, but only if they match exactly the
  // sort of styles that would be produced by exportDOM
  let extraStyles = "";
  const fontSize = parseAllowedFontSize(element.style.fontSize);
  const backgroundColor = parseAllowedColor(element.style.backgroundColor);
  const color = parseAllowedColor(element.style.color);
  if (fontSize !== "" && fontSize !== "15px") {
    extraStyles += `font-size: ${fontSize};`;
  }
  if (backgroundColor !== "" && backgroundColor !== "rgb(255, 255, 255)") {
    extraStyles += `background-color: ${backgroundColor};`;
  }
  if (color !== "" && color !== "rgb(0, 0, 0)") {
    extraStyles += `color: ${color};`;
  }
  return extraStyles;
};

const constructImportMap = (): DOMConversionMap => {
  const importMap: DOMConversionMap = {};

  // Wrap all TextNode importers with a function that also imports
  // the custom styles implemented by the playground
  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode);
      if (!importer) {
        return null;
      }
      return {
        ...importer,
        conversion: (element) => {
          const output = importer.conversion(element);
          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output;
          }
          const extraStyles = getExtraStyles(element);
          if (extraStyles) {
            const { forChild } = output;
            return {
              ...output,
              forChild: (child, parent) => {
                const textNode = forChild(child, parent);
                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles);
                }
                return textNode;
              },
            };
          }
          return output;
        },
      };
    };
  }

  return importMap;
};

const editorConfig = {
  html: {
    export: exportMap,
    import: constructImportMap(),
  },
  namespace: "YATODA",
  nodes: [ParagraphNode, TextNode, CustomNode],
  onError(error: Error) {
    throw error;
  },
  theme: ExampleTheme,
};

export function Editor(props: {
  placeholder?: string;
  inputRef: RefObject<HTMLDivElement | null>;
  onSubmit: (e: KeyboardEvent) => void;
}) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container text-black w-full mx-3 px-3 shadow-lg py-2">
        <div className="editor-inner bg-white relative rounded-md">
          <RichTextPlugin
            contentEditable={
              <>
                <div className="absolute top-4 text-sky-500 ml-2">
                  <FeatherIcon iconName="plus-square"></FeatherIcon>
                </div>
                <ContentEditable
                  ref={props.inputRef}
                  className="editor-input ml-6"
                  aria-placeholder={props.placeholder || ""}
                  placeholder={
                    <div className="editor-placeholder ml-6">
                      {props.placeholder}
                    </div>
                  }
                />
                <div className="absolute right-0 top-0 w-20 h-full">
                  <div className="h-full flex justify-end items-start mt-5 mr-3">
                    <span className="avatar avatar-placeholder avatar-online avatar-group">
                      <img className="" src="/vite.svg"></img>
                    </span>
                  </div>
                </div>
              </>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <div className="divider"></div>
          <HistoryPlugin />
          <AutoFocusPlugin />
          <KeywordHighlightPlugin></KeywordHighlightPlugin>
          <EnterKeyHandlerPlugin
            onSubmit={props.onSubmit}
          ></EnterKeyHandlerPlugin>
          <ToolbarPlugin actionState="plus" />
        </div>
      </div>
    </LexicalComposer>
  );
}

export default Editor;
