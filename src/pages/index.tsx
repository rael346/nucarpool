import { Dialog, Transition } from "@headlessui/react";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { collection, query } from "firebase/firestore";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { NextPage } from "next";
import { Fragment, useEffect, useState } from "react";
import { RiFocus3Line } from "react-icons/ri";
import ProfileModal from "../components/ProfileModal";
import Spinner from "../components/Spinner";
import { db } from "../utils/firebase/firebase.config";
import addClusters from "../utils/map/addClusters";
import addMapEvents from "../utils/map/addMapEvents";
import addUserLocation from "../utils/map/addUserLocation";
import toFeatures from "../utils/map/toFeatures";
import useUser from "../hooks/useUser";

export const getServerSideProps = async () => {
	return {
		props: {
			accessToken: process.env.MAPBOX_ACCESS_TOKEN,
		},
	};
};

const Home: NextPage<any> = ({ accessToken }) => {
	const { user, userInfo, checkingStatus } = useUser();
	const [isMap, setMap] = useState<boolean>(false);

	const ref = query(collection(db, "users"));
	const { isLoading, data } = useFirestoreQuery(["users"], ref);
	mapboxgl.accessToken = accessToken;

	useEffect(() => {
		if (!isMap && user && userInfo && data?.docs) {
			const features = toFeatures(user.uid, data);

			const map = new mapboxgl.Map({
				container: "map",
				style: "mapbox://styles/mapbox/light-v10",
				center: userInfo.companyCoord,
				zoom: 10,
			});

			map.on("load", () => {
				addClusters(map, features);
				addUserLocation(map, userInfo);
				addMapEvents(map, userInfo);
			});
			setMap(true);
		}
	}, [isMap, userInfo, data, user]);

	if (checkingStatus || isLoading) {
		return <Spinner />;
	}
	return (
		<>
			<ProfileModal userInfo={userInfo!} user={user!} />
			<button
				className="flex justify-center items-center w-8 h-8 absolute z-10 right-[8px] bottom-[150px] rounded-md bg-white border-2 border-solid border-gray-300 shadow-sm hover:bg-gray-200"
				id="fly"
			>
				<RiFocus3Line />
			</button>
			<div id="map" className="h-screen"></div>
		</>
	);
};

export default Home;
