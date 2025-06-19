export interface IMessagesState {
  item: IMessage | null;
  saveLoader: boolean;
  loader_with_message: {
    loading: boolean;
    message?: string;
  };
}

export interface IMessage {
  type: "error" | "success" | "warning";
  message: string | React.ReactNode;
  displayAs: "snackbar" | "dialog";
}
