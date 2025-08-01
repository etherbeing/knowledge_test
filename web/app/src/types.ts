export interface Categories {
  [name: string]: {
    defaultSelected?: boolean;
  };
}
export interface Subtask {
  name: string;
  description?: string;
  category: keyof Categories;
}
export interface TodoEl {
  name: string;
  owner: string;
  date: string;
}
