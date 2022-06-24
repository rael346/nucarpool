import { DocumentData, QuerySnapshot } from "firebase/firestore";
import { Feature } from "geojson";
import { UserInfo } from "../types";

/**
 * Convert the UserInfo data from Firestore to geojson Features to
 * display on map
 * @param uid the uid of the current user to be removed from the list
 * (since we are displaying the current user through addUserLocation,
 * we don't want overlap with addClusters)
 * @param data the UserInfo(s) fetched from Firestore
 * @returns A list of geojson Feature representing every users' company locations
 * on the map (except for the current user)
 */
const toFeatures = (uid: string, data: QuerySnapshot<DocumentData>) => {
	const features: Feature[] = [];
	data.docs.forEach((doc) => {
		if (doc.id === uid) return;

		const data = doc.data() as UserInfo;
		features.push({
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: data.companyCoord,
			},
			properties: {
				...data,
			},
		});
	});

	return features;
};

export default toFeatures;
