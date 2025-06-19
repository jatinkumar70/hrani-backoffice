import { ILoadState } from "@/redux/store.enums";
import {
  ISecurityRoleGroup,
  ISecurityRoleGroupState,
} from "./role-group.types";

export const defaultSecurityRoleGroup: ISecurityRoleGroup = {
  role_group_uuid: null,
  role_group: "",
  status: "ACTIVE",
};

export const defaultSecurityRoleGroupState: ISecurityRoleGroupState = {
  role_group_list: {
    loading: ILoadState.idle,
    data: [],
    totalRecords: 0,
    error: null,
  },
  single_role_group: {
    loading: ILoadState.idle,
    data: defaultSecurityRoleGroup,
    error: null,
  },
};
