import type { NextPage } from "next";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import useUser from "../hooks/useUser";

const Home: NextPage = () => {
	const { user, isLoading } = useUser();
	if (isLoading) {
		return <Spinner />;
	}

	const notify = () => {
		toast.error("Error");
	};
	return (
		<>
			<h1 className="text-3xl font-bold underline">Home</h1>
			<button onClick={notify}>Test toast</button>
		</>
	);
};

export default Home;
