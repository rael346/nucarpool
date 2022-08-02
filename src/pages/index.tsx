import { Dialog, Transition } from "@headlessui/react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { GetServerSidePropsContext, NextPage } from "next";
import { Fragment, useEffect, useState } from "react";
import { RiFocus3Line } from "react-icons/ri";
import ProfileModal from "../components/ProfileModal";
import Spinner from "../components/Spinner";
import addClusters from "../utils/map/addClusters";
import addMapEvents from "../utils/map/addMapEvents";
import addUserLocation from "../utils/map/addUserLocation";
import toFeatures from "../utils/map/toFeatures";
import { NextPageWithAuthAndLayout } from "../utils/types";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import Head from "next/head";

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const session = await getServerSession(context.req, context.res, authOptions);

	if (session?.user) {
		if (!session.user.isOnboarded) {
			return {
				redirect: {
					destination: "/onboard",
					permanent: false,
				},
			};
		}
	} else {
		return {
			redirect: {
				destination: "/sign-in",
				permanent: false,
			},
		};
	}

	return {
		props: {
			accessToken: process.env.MAPBOX_ACCESS_TOKEN,
		},
	};
}

const Home: NextPage<any> = ({ accessToken }) => {
	const [isMap, setMap] = useState<boolean>(false);

	mapboxgl.accessToken = accessToken;

	useEffect(() => {
		if (true) {
			// const features = toFeatures(user.uid, data);

			const map = new mapboxgl.Map({
				container: "map",
				style: "mapbox://styles/mapbox/light-v10",
				center: [70, 40],
				zoom: 10,
			});

			// map.on("load", () => {
			// 	addClusters(map, features);
			// 	addUserLocation(map, userInfo);
			// 	addMapEvents(map, userInfo);
			// });
			setMap(true);
		}
	}, [isMap]);

	return (
		<>
			<Head>
				<title>Home</title>
			</Head>
			{/* <ProfileModal userInfo={userInfo!} user={user!} /> */}
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
