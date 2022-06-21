import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { auth, db } from "../utils/firebase/firebase.config";
import GoogleOAuthButton from "./GoogleOAuthButton";

const GoogleOAuth = () => {
	const { push } = useRouter();

	const onGoogleClick = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const user = result.user;

			const docRef = doc(db, "users", user.uid);
			const docSnap = await getDoc(docRef);

			if (!docSnap.exists()) {
				push("/onboarding");
			} else {
				push("/");
			}
		} catch (error) {
			toast.error("Failed to login");
		}
	};

	return (
		<div onClick={onGoogleClick}>
			<GoogleOAuthButton />
		</div>
	);
};

export default GoogleOAuth;
