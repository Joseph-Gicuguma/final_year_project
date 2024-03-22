import { useRecordContext } from "react-admin";

const CompanyTitle = () => {
	const record = useRecordContext();
	return <span>Business {record ? `: ${record.name}` : ''}</span>;
};

export default CompanyTitle;

