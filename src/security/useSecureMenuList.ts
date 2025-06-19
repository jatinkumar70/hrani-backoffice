import React from "react";
import { NavigationTree } from "@/@types/navigation";
import { useAuthContext } from "@/contexts";

// export const useSecureMenuList = (navigationConfig: NavigationTree[]): NavigationTree[] => {
//   const [menuList, setMenuList] = React.useState(navigationConfig);
//   const { userAccessibleModules } = useAuthContext();

//   React.useEffect(() => {
//     if (userAccessibleModules.length > 0) {
//       const accessibleModuleIds = userAccessibleModules.filter((module) =>
//         module.show_module === 1 /* Add more conditions for other permissions if needed */
//       ).map((module) => module.module_key);

//       const filterNavbarMenu = (navMenu: NavigationTree[]): NavigationTree[] => {
//         return navMenu.map((nav_manu => {
//           return { ...nav_manu, items: filterNavbarMenuItems(nav_manu.subMenu) }
//         })).filter((nav_manu) => nav_manu.items.length > 0)
//       };

//       // Function to filter menu items recursively
//       const filterNavbarMenuItems = (navMenuItems: NavigationTree[]): NavigationTree[] => {
//         return navMenuItems.map((nam_menu_item) => {
//           if (nam_menu_item.subMenu) {
//             const filteredChildren = filterNavbarMenuItems(nam_menu_item.subMenu);
//             nam_menu_item.subMenu = filteredChildren.filter((childItem) =>
//               childItem.modules.some((id) => accessibleModuleIds.includes(id)) || childItem.allowFullAccess
//             );
//           }
//           return nam_menu_item;
//         }).filter((item) =>
//           item.modules.some((id) => accessibleModuleIds.includes(id)) || item.allowFullAccess
//         );
//       };

//       // Filter the static menu list based on accessibleModuleIds
//       const filteredMenu = filterNavbarMenu(navigationConfig);
//       setMenuList(filteredMenu);
//     }
//   }, [userAccessibleModules, navigationConfig]);

//   return menuList;
// };


export const useSecureMenuList = (navigationConfig: NavigationTree[]): NavigationTree[] => {
  const [menuList, setMenuList] = React.useState<NavigationTree[]>(navigationConfig);
  const { userAccessibleModules } = useAuthContext();

  React.useEffect(() => {
    if (!userAccessibleModules.length) return;

    const accessibleModuleIds = userAccessibleModules
      .filter(module => module.show_module === 1)
      .map(module => module.module_key);

    const filterMenuItems = (items: NavigationTree[]): NavigationTree[] => {
      return items
        .map(item => {
          const filteredSubMenu = item.subMenu ? filterMenuItems(item.subMenu) : [];
          const isItemAccessible = item.modules?.some(id => accessibleModuleIds.includes(id)) || item.allowFullAccess;

          if (filteredSubMenu.length > 0 || isItemAccessible) {
            return {
              ...item,
              subMenu: filteredSubMenu
            };
          }
          return null;
        })
        .filter(Boolean) as NavigationTree[];
    };

    const filteredMenu = filterMenuItems(navigationConfig);
    setMenuList(filteredMenu);
  }, [userAccessibleModules, navigationConfig]);

  return menuList;
};
