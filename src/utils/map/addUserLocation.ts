import { Map } from "mapbox-gl";
import { UserInfo } from "../types";
import PulsingDot from "./PulsingDot";

const addUserLocation = (map: Map, userData: UserInfo) => {
	map.addSource("dot-point", {
		type: "geojson",
		data: {
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: userData.companyCoord, // icon position [lng, lat]
			},
			properties: {},
		},
	});

	map.addImage("pulsing-dot", new PulsingDot(100, map), {
		pixelRatio: 2,
	});

	map.addLayer({
		id: "layer-with-pulsing-dot",
		type: "symbol",
		source: "dot-point",
		layout: {
			"icon-image": "pulsing-dot",
			"icon-allow-overlap": true,
		},
	});
};

export default addUserLocation;
