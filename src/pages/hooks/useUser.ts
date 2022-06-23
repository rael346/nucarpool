import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../../utils/firebase/firebase.config";
import { UserInfo } from "../../utils/types";

const useUser = () => {
	const [user, setUser] = useState<User | null>(null);
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
	const [checkingStatus, setStatus] = useState(true);
	const isMounted = useRef(true);
	const { pathname, push } = useRouter();

	useEffect(() => {
		if (isMounted) {
			onAuthStateChanged(auth, async (user) => {
				if (user) {
					try {
						const docRef = doc(db, "users", user.uid);
						const docSnap = await getDoc(docRef);

						if (!docSnap.exists() && pathname != "/onboarding") {
							push("/onboarding");
						} else if (docSnap.exists() && pathname != "/") {
							push("/");
						} else {
							setUser(user);
							setUserInfo(docSnap.data() as UserInfo);
						}
					} catch (error) {
						console.log(error);
						toast.error("Could not fetch user. Please refresh the page.");
					}
				} else if (pathname != "/auth") {
					push("/auth");
				}
				setStatus(false);
			});
		}

		return () => {
			isMounted.current = false;
		};
	}, [isMounted, pathname, push]);

	return { user, userInfo, checkingStatus };
};

export default useUser;
