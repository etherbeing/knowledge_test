import type { RefObject } from "react"

export default function RichTextCompletePane(props: { query: string, selected: number, elements: string[], inputRef: RefObject<HTMLDivElement | null> }) {
    return (props.inputRef.current &&
        <div style={{
            top: props.inputRef.current.clientHeight,
        }} className="absolute bg-white rounded shadow-lg mt-1 w-full py-3 px-3 flex gap-1 flex-col">
            {
                props.elements.filter((element) => {
                    return props.query.length > 0 ? element.toLowerCase().includes(props.query) : true
                }).map((element, i) => {
                    return (
                        <div key={i} className={
                            `bg-sky-300 rounded px-3 py-2 shadow hover:shadow-lg transition-shadow ${props.selected === i ? "bg-sky-700 hover:bg-sky-400" : "hover:bg-sky-600"}`
                        }>
                            {element}
                        </div>
                    )
                })
            }
        </div>
    )
}