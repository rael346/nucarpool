import type { NextPage } from "next";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import useUser from "./hooks/useUser";
import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import { useEffect, useState } from "react";
import {
	query,
	collection,
	doc,
	DocumentData,
	getDocs,
	QuerySnapshot,
} from "firebase/firestore";
import { auth, db } from "../utils/firebase/firebase.config";
import {
	useFirestoreDocument,
	useFirestoreDocumentData,
	useFirestoreQuery,
	useFirestoreQueryData,
} from "@react-query-firebase/firestore";
import { UserInfo } from "../utils/types";
import addUserLocation from "../utils/map/addUserLocation";
import addMapEvents from "../utils/map/addMapEvents";
import { RiFocus3Line } from "react-icons/ri";
import "mapbox-gl/dist/mapbox-gl.css";
import { Feature } from "geojson";
import addClusters from "../utils/map/addClusters";
import toFeatures from "../utils/map/toFeatures";

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
