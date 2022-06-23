import { Feature } from "geojson";
import { Map } from "mapbox-gl";
/**
 * Filter Expression: https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/
 * Clusters example with filter expression: https://docs.mapbox.com/mapbox-gl-js/example/cluster-html/
 * Clusters example: https://docs.mapbox.com/mapbox-gl-js/example/cluster/
 */

const addClusters = (map: Map, features: Feature[]) => {
	map.addSource("company-locations", {
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: features,
		},
		cluster: true,
		clusterMaxZoom: 14,
		clusterRadius: 50,
	});

	map.addLayer({
		id: "clusters",
		type: "circle",
		source: "company-locations",
		filter: ["has", "point_count"],
		paint: {
			"circle-color": [
				"step",
				["get", "point_count"],
				"#51bbd6",
				20,
				"#f1f075",
				100,
				"#f28cb1",
			],
			"circle-radius": [
				"step",
				["get", "point_count"],
				20,
				20, // point count > 20
				30,
				100, // point count > 100
				40,
			],
		},
	});

	map.addLayer({
		id: "cluster-count",
		type: "symbol",
		source: "company-locations",
		filter: ["has", "point_count"],
		layout: {
			"text-field": "{point_count_abbreviated}",
			"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
			"text-size": 12,
		},
	});

	map.addLayer({
		id: "unclustered-point",
		type: "circle",
		source: "company-locations",
		filter: ["!", ["has", "point_count"]],
		paint: {
			"circle-color": [
				"case",
				[
					"all",
					["==", ["get", "status"], "active"], // active user
					["==", ["get", "rdStatus"], "rider"], // also a rider
				],
				"#0ea5e9", // blue-ish color
				[
					"all",
					["==", ["get", "status"], "active"], // active user
					["==", ["get", "rdStatus"], "driver"], // also a driver
				],
				"#f97316", // red-ish color
				"#808080", // gray for inactive user
			],
			"circle-radius": 10,
			"circle-stroke-width": 2,
			"circle-stroke-color": "#fff",
		},
	});
};

export default addClusters;
