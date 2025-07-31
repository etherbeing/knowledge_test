import RichTextEditor from "./RichTextEditor";

export default function TaskComment(props: { username: string, }) {
    return (
        <div className="h-20 mb-3 flex flex-col gap-1 px-2">
            <label htmlFor="comment" className="flex justify-between lowercase text-sm">
                <span>
                    {new Date().toDateString()}
                </span>
                <span>
                    @{props.username}
                </span>
            </label>
            <RichTextEditor></RichTextEditor>
            <span className="text-sm text-gray-500">
                Press enter to comment on this task
            </span>
        </div>
    )
}