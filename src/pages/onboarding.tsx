import { NextPage } from "next";
import Spinner from "../components/Spinner";
import useUser from "./hooks/useUser";

const Onboarding: NextPage = () => {
	const { user, isLoading } = useUser();
	if (isLoading) {
		return <Spinner />;
	}

	return <div>Onboarding</div>;
};

export default Onboarding;
