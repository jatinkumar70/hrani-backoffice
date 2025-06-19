import { IPremissions } from "@/redux";
import React from "react";

interface IPremissionsContext {
  premissions: IPremissions[];
}

const PremissionsContext = React.createContext<IPremissionsContext>({
  premissions: [],
});

export const usePremissions = () => {
  const { premissions } = React.useContext(PremissionsContext);

  const getPremissionsByModuleId = (moduleId: string) => {
    const premission = premissions.find((x) => x.table_name === moduleId);
    if (premission) {
      return premission;
    } else {
      return {
        column_relation_options: [],
        filter_values: {},
        module_id: -1,
        module_name: "",
        role_id: -1,
        role_name: "",
        submodule_name: "",
        table_name: "",
        role_module_code: "",
        view_access: -1,
        edit_access: -1,
        bulk_export: -1,
        bulk_import: -1,
        send_mail: -1,
        send_sms: -1,
        send_whatsapp: -1,
        send_call: -1,
      };
    }
  };

  return {
    premissionsList: premissions,
    getPremissionsByModuleId,
  };
};

export const PremissionsProvider: React.FC<{
  children: React.ReactNode;
  premissions: IPremissions[];
}> = (props) => {
  return (
    <PremissionsContext.Provider
      value={{
        premissions: props.premissions,
      }}
    >
      {props.children}
    </PremissionsContext.Provider>
  );
};
