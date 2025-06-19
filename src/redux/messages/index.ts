import { ActionType } from "typesafe-actions";

import * as Actions from "./messagesActions";

export type MessageActions = ActionType<typeof Actions>;
