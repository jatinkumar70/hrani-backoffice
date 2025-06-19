import { ISecurityGroup, ISecurityNestedGroup } from "./app-security.types";


export const createNestedSecurityGroup = (groups: ISecurityGroup[]) => {
    const initialNestedGroup: ISecurityNestedGroup = {
        modules: {},
    };
    for (const group of groups) {
        if (initialNestedGroup.modules[group.module_name]) {
            initialNestedGroup.modules[group.module_name].children.push(group);
        } else {
            initialNestedGroup.modules[group.module_name] = {
                children: [group],
            };
        }
    }
    return initialNestedGroup;
};

export const parseNestedSecurityGroups = (group: ISecurityNestedGroup): ISecurityGroup[] => {
    let list: ISecurityGroup[] = [];
    for (const key in group.modules) {
        const item = group.modules[key];
        let childs: any = [];
        if (item.children.length > 0) {
            childs = [...item.children];
        }
        list = [...list, ...childs];
    }
    return list;
};