const API_ENDPOINTS = {
	LOGIN: "/auth/login",
	USER: {
		USER_ME: "/user",
	},
	FILE: {
		IMAGE: "/api/v1/files",
		PDF: "/api/v1/files/pdf",
	},
	COLLAGE: {
		GETALL: "/college",
		CREATE: "college",
		DELETE: "/college",
		UPDATE: "/college",
	},
	DEPARTMENT: {
		CREATE: "/department",
		DELETE: "/department",
		UPDATE: "/department",
		PAGE: "/department/page",
		LIST: "/department/list",
	},
	POSITION: {
		LAVOZIM: "/lavozim",
		STATISTIC: "/lavozim/get-lavozim-statistiks",
	},
	TEACHER: {
		SEARCH: "/teacher/search",
		DELETE: "/teacher",
		CREATE: "/teacher/saveUser",
		EDIT: "/teacher/edit",
		UPDATE_PROFILE: "/teacher/update-profile",
	},
	USER_STATISTICS: "/user/statistics",
	RESEARCH: {
		GETBYID: "/research/byUser",
		DELETE: "/research",
		CREATE: "/research",
		UPDATE: "/research",
	},
	NAZORAT: {
		GETBYID: "/nazorat/byUser",
		DELETE: "/nazorat",
		CREATE: "/nazorat",
		UPDATE: "/nazorat",
	},
	NASHR: {
		GETBYID: "/api/publication/byUser",
		DELETE: "/api/publication",
		CREATE: "/api/publication",
		UPDATE: "/api/publication",
	},
	MASLAHAT: {
		GETBYID: "/api/consultation/byUser",
		DELETE: "/api/consultation",
		CREATE: "/api/consultation",
		UPDATE: "/api/consultation",
	},
	MUKOFOT: {
		GETBYID: "/award/byUser",
		DELETE: "/award",
		CREATE: "/award",
		UPDATE: "/award",
	},
	USER_COMPLETION: "/user/profile-completion",
};

export const {
	LOGIN,
	USER,
	FILE,
	COLLAGE,
	DEPARTMENT,
	POSITION,
	TEACHER,
	USER_STATISTICS,
	RESEARCH,
	MASLAHAT,
	MUKOFOT,
	NASHR,
	NAZORAT,
	USER_COMPLETION,
} = API_ENDPOINTS;
