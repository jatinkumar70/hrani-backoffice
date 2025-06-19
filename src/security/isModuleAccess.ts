import { IPremissions, ISecurityGroup } from "@/redux";
import { some } from "lodash";

const allAccess = [
  "view_access",
  "edit_access",
  "bulk_import",
  "send_sms",
  "send_mail",
  "send_whatsapp",
];

const disabledRoleBased = false;

export const isModuleAccess = (
  currentModuleIds: string[],
  userRoles: ISecurityGroup[],
  allowFullAccess?: boolean,
) => {
  if (disabledRoleBased) {
    return true;
  }

  if (allowFullAccess) {
    return true;
  }

  return userRoles.some((role) => {
    return currentModuleIds.some(
      (id) =>
        role.module_key === id &&
        (role.show_module === 1 || role.view_access === 1),
    );
  });
};

export const getModulePremissions = (
  currentModuleIds: string[],
  userRoles: ISecurityGroup[],
  allowFullAccess?: boolean,
): IPremissions[] => {
  if (allowFullAccess || disabledRoleBased) {
    return [
      {
        module_uuid: "",
        column_relation_options: [],
        filter_values: {},
        module_id: "",
        module_name: "",
        module_key: "",
        role_id: -1,
        role_uuid: -1,
        role_name: "",
        submodule_name: "",
        table_name: "",
        role_module_code: "",
        show_module: -1,
        view_access: -1,
        edit_access: -1,
        bulk_export: -1,
        bulk_import: -1,
        send_mail: -1,
        send_sms: -1,
        send_whatsapp: -1,
        send_call: -1,
      },
    ];
  }
  const finalPresmissions: IPremissions[] = [];

  for (let moduleId of currentModuleIds) {
    const module = userRoles.find((x) => x.table_name === moduleId);
    if (module) {
      finalPresmissions.push(module);
    } else {
      finalPresmissions.push({
        module_uuid: "",
        column_relation_options: [],
        filter_values: {},
        module_id: moduleId,
        module_name: "",
        module_key: "",
        role_id: -1,
        role_uuid: -1,
        role_name: "",
        submodule_name: "",
        table_name: "",
        role_module_code: "",
        show_module: 0,
        view_access: 0,
        edit_access: 0,
        bulk_export: 0,
        bulk_import: 0,
        send_mail: 0,
        send_sms: 0,
        send_whatsapp: 0,
        send_call: 0,
      });
    }
  }
  return finalPresmissions;
};
