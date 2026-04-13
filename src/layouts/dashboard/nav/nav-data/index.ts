import type { NavItemDataProps } from "@/components/nav/types";
import { useUserPermissions, useUserRoles } from "@/store/userStore";
import { checkAny } from "@/utils";
import { useMemo } from "react";
import { navData } from "./nav-data";
import { teacherNavData } from "./teacher-nav-data";

const filterItems = (items: NavItemDataProps[], permissions: string[]) => {
	return items.filter((item) => {
		const hasPermission = item.auth ? checkAny(item.auth, permissions) : true;

		if (item.children?.length) {
			const filteredChildren = filterItems(item.children, permissions);
			if (filteredChildren.length === 0) {
				return false;
			}
			item.children = filteredChildren;
		}

		return hasPermission;
	});
};

const filterNavData = (permissions: string[]) => {
	return navData
		.map((group) => {
			const filteredItems = filterItems(group.items, permissions);

			if (filteredItems.length === 0) {
				return null;
			}

			return {
				...group,
				items: filteredItems,
			};
		})
		.filter((group): group is NonNullable<typeof group> => group !== null); // 过滤掉空组
};

export const useFilteredNavData = () => {
	const roles = useUserRoles();
	const permissions = useUserPermissions();
	const isTeacher = useMemo(() => roles.some((r) => r.code === "ROLE_TEACHER"), [roles]);
	const permissionCodes = useMemo(() => permissions.map((p) => p.code), [permissions]);
	const filteredNavData = useMemo(
		() => (isTeacher ? teacherNavData : filterNavData(permissionCodes)),
		[isTeacher, permissionCodes],
	);
	return filteredNavData;
};
