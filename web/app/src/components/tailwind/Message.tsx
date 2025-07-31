import { useState } from "react"

export default function Message(props: { onSelect?: (selected: boolean) => void, username: string, message: string, createdAt: string }) {
    const [selected, setSelected] = useState(false);
    const [editing, setEditing] = useState(false);
    return (
        <div
            onKeyUp={(e) => {
                switch (e.code) {
                    default:
                        console.log("Pressed ", e.code)
                }
            }}
            onDoubleClick={() => {
                setEditing(true)
                setSelected(false)
            }} 
            onClick={() => {
                if (props.onSelect) {
                    props.onSelect(!selected)
                }
                setSelected(!selected);
            }}
            className={
                `${editing || selected ? "" : "hover:"}shadow-md cursor-default transition-shadow py-2 rounded-lg flex flex-col justify-center items-center w-full gap-3 px-3`
            } >
            <div className="flex justify-between items-center w-full">
                <img className="" src="/vite.svg"></img>
                <div className="flex flex-col text-xs">
                    <span className="">@{props.username}</span>
                    <span className="text-gray-500">{props.createdAt}</span>
                </div>
            </div>
            <div className="w-full text-justify text-sm">
                {props.message}
            </div>
        </div >
    )
}