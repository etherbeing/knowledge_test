import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { TaskT, UserT } from "./types";

const api = createApi({
  reducerPath: "apiRoot",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL + "/api/",
    credentials: "include",
    prepareHeaders: (headers) => {
      const csrftoken =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("csrftoken="))
          ?.split("=")[1] || null;
      if (csrftoken) {
        headers.set("X-CSRFToken", csrftoken);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (build) => ({
    getTasks: build.query<Array<TaskT>, void>({
      query: () => ({
        url: `todo/tasks/`,
      }),
    }),
    createTask: build.mutation<void, TaskT>({
      query: (data) => ({
        url: `todo/tasks/create/`,
        method: "POST",
        body: data,
      }),
    }),
    deleteTask: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `todo/${id}/tasks/delete/`,
        method: "DELETE",
      }),
    }),
    updateTask: build.mutation<void, { id: number; data: TaskT }>({
      query: ({ id, data }) => ({
        url: `todo/${id}/tasks/`,
        method: "PATCH",
        body: data,
      }),
    }),
    getCurrentUser: build.query<UserT, void>({
      query: () => ({
        url: `security/user/`,
      }),
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useGetTasksQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} = api;
export default api;
