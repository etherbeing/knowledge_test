import type { Dispatch, SetStateAction } from "react";

export default function ContextMenu(props: { event: React.MouseEvent<HTMLDivElement> | undefined, setEvent: Dispatch<SetStateAction<React.MouseEvent<HTMLDivElement> | undefined>> }) {
    return (
        props.event &&
        <div onMouseLeave={() => props.setEvent(undefined)} style={{
            left: props.event.clientX - 10,
            top: props.event.clientY - 10,
        }} className={`bg-sky-500 border-e-sky-950 border-thin  shadow-md text-white px-1 h-60 w-50  rounded-sm absolute`}>
            <div className="hover:shadow px-3 py-2 mt-2 w-full border-b-0 cursor-pointer  border-b-blue-800">
                custom context menu
            </div>
        </div>
    )
}