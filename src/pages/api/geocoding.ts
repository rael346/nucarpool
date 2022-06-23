import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${req.body.value}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}&autocomplete=true`;
		const data = await fetch(endpoint).then((response) => response.json());
		return res.status(200).json(data);
	} catch (e) {
		return res.status(500).json({ error: "Unexpected error." });
	}
};

export default handler;
