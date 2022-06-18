import type { NextPage } from "next";
import { toast } from "react-toastify";

const Home: NextPage = () => {
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
