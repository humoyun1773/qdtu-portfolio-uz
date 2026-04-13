import enUS from "antd/locale/en_US";

const useLocale = () => {
	return {
		t: (key: string) => key,
		language: {
			antdLocal: enUS,
		},
	};
};

export default useLocale;
