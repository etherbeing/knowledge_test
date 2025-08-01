import type { UserT } from "./services/types";

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
  owner: UserT;
  date: string;
}
