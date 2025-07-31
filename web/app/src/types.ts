export interface Categories {
    [name: string]: {
        defaultSelected?: boolean
    }
}
export interface Subtask {
    name: string
    description?: string
    category: keyof Categories
}