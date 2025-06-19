import { thunk } from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";

import { root_reducer } from "./root.reducer";

export const appStore = configureStore({
  reducer: root_reducer,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  // initialStoreState,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof appStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof appStore.dispatch;
