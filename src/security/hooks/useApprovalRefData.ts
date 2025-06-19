import axios_base_api from "@/api/axios-base-api";
import React from "react";

interface IModules {
  module_uuid: string;
  module_name: string;
  submodule_name: string;
  table_name: string;
  map_column_user_uuid: any;
  column_relation_options: any;
}

interface IRoles {
  role_id: number;
  role_uuid: string;
  role_name: string;
  role_value: string;
  role_group: string;
  status: string;
  created_by_uuid: string;
  insert_ts: string;
}

export const useApprovalRefData = () => {
  const [modulesList, setModulesList] = React.useState<IModules[]>([]);
  const [rolesList, setRolesList] = React.useState<IRoles[]>([]);
  // const dispatch = useAppDispatch();

  const fetchModules = async () => {
    try {
      const response = await axios_base_api.get("/security/get-modules");
      setModulesList(response.data.data);
    } catch (error: any) {
      // dispatch(
      //   showMessage({
      //     displayAs: "snackbar",
      //     message: error.response.data.message,
      //     type: "error",
      //   }),
      // );
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios_base_api.get(
        "/security/get-roles?pageNo=1&itemPerPage=1000",
      );
      setRolesList(response.data.data);
    } catch (error: any) {
      // dispatch(
      //   showMessage({
      //     displayAs: "snackbar",
      //     message: error.response.data.message,
      //     type: "error",
      //   }),
      // );
    }
  };

  React.useEffect(() => {
    fetchModules();
    fetchRoles();
  }, []);

  return {
    modulesList,
    rolesList,
  };
};
