import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

const api = createApi({
  reducerPath: "apiRoot",
  baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
  endpoints: (build) => ({
    get: build.query<void, void>({
      query: (name) => `sample/${name}`,
    }),
  }),
});

export default api;
