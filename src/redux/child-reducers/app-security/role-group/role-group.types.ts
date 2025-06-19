import { ILoadState } from "@/redux/store.enums";

export interface ISecurityRoleGroup {
  role_group_uuid: string | null;
  role_group: string;
  status: "ACTIVE" | "INACTIVE";

  create_ts?: string;
  insert_ts?: string;
}

export interface ISecurityRoleGroupState {
  role_group_list: {
    loading: ILoadState;
    data: ISecurityRoleGroup[];
    totalRecords: number;
    error: string | null;
  };
  single_role_group: {
    loading: ILoadState;
    data: ISecurityRoleGroup;
    error: string | null;
  };
}
