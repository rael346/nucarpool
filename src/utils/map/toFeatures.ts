import { DocumentData, QuerySnapshot } from "firebase/firestore";
import { Feature } from "geojson";
import { UserInfo } from "../types";

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
