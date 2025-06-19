import { action } from "typesafe-actions";
import { IMessage } from "./messages.types";

export const SHOW_MESSAGE = "SHOW_MESSAGE";
export const HIDE_MESSAGE = "HIDE_MESSAGE";

export const showMessage = (message: IMessage) =>
  action(SHOW_MESSAGE, { message });
export const hideMessage = () => action(HIDE_MESSAGE);

export const SAVE_LOADER_PROGRESS = "SAVE_LOADER_PROGRESS";
export const SAVE_LOADER_DONE = "SAVE_LOADER_DONE";

export const saveLoaderProgress = () => action(SAVE_LOADER_PROGRESS);
export const saveLoaderCompleted = () => action(SAVE_LOADER_DONE);

export const SHOW_LOADER_WITH_MESSAGE = "SHOW_LOADER_WITH_MESSAGE";
export const HIDE_LOADER_WITH_MESSAGE = "HIDE_LOADER_WITH_MESSAGE";

export const openLoaderWithMessage = (message?: string) =>
  action(SHOW_LOADER_WITH_MESSAGE, { message });
export const closeLoaderWithMessage = () => action(HIDE_LOADER_WITH_MESSAGE);
