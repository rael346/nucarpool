import { NextPage } from "next";
import GoogleOAuth from "../components/GoogleOAuth";
import Header from "../components/Header";
import Spinner from "../components/Spinner";
import useUser from "./hooks/useUser";

const Auth: NextPage = () => {
	const { checkingStatus } = useUser();

	if (checkingStatus) {
		return <Spinner />;
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100">
			<div className="rounded-2xl w-fit bg-white flex flex-col justify-center items-center p-6 m-4 space-y-4 drop-shadow-lg">
				<Header />
				<GoogleOAuth />
			</div>
		</div>
	);
};

export default Auth;
