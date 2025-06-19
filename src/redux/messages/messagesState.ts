import { IMessagesState } from "./messages.types";

export const initialMessagesState: IMessagesState = {
  item: null,
  saveLoader: false,
  loader_with_message: {
    loading: false,
  },
};
