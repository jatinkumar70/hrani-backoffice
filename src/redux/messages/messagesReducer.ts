import produce from "immer";
import { MessageActions } from ".";
import { IStoreState } from "../initialStoreState";
import {
  HIDE_LOADER_WITH_MESSAGE,
  HIDE_MESSAGE,
  SAVE_LOADER_DONE,
  SAVE_LOADER_PROGRESS,
  SHOW_LOADER_WITH_MESSAGE,
  SHOW_MESSAGE,
} from "./messagesActions";
import { initialMessagesState } from "./messagesState";

export const messageReducer = (
  state: IStoreState["message"] = initialMessagesState,
  action: MessageActions,
) => {
  switch (action.type) {
    case SHOW_MESSAGE: {
      const { message } = action.payload;
      const newState = produce(state, (draftState) => {
        draftState.item = message;
      });
      return newState;
    }
    case HIDE_MESSAGE: {
      const newState = produce(state, (draftState) => {
        draftState.item = null;
      });
      return newState;
    }
    case SAVE_LOADER_PROGRESS: {
      const newState = produce(state, (draftState) => {
        draftState.saveLoader = true;
      });
      return newState;
    }
    case SAVE_LOADER_DONE: {
      const newState = produce(state, (draftState) => {
        draftState.saveLoader = false;
      });
      return newState;
    }

    case SHOW_LOADER_WITH_MESSAGE: {
      const { message } = action.payload;
      const newState = produce(state, (draftState) => {
        draftState.loader_with_message.loading = true;
        draftState.loader_with_message.message = message;
      });
      return newState;
    }
    case HIDE_LOADER_WITH_MESSAGE: {
      const newState = produce(state, (draftState) => {
        draftState.loader_with_message.message =
          initialMessagesState["loader_with_message"]["message"];
        draftState.loader_with_message.loading = false;
      });
      return newState;
    }

    default: {
      return state;
    }
  }
};
