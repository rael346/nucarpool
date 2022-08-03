export type ProfileFormInputs = {
	firstName: string;
	lastName: string;
	rdStatus: "rider" | "driver";
	seatsAvailability: number;
	companyName: string;
	companyAddress: string;
	status: "active" | "inactive";
};

export type UserInfo = {
	firstName: string;
	lastName: string;
	email: string;
	rdStatus: "driver" | "rider";
	seatsAvailability: number;
	status: "active" | "inactive";
	companyName: string;
	companyAddress: string;
	companyCoord: [number, number];
};
