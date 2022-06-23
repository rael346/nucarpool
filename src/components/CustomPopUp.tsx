import React from "react";
import { UserInfo } from "../utils/types";

const CustomPopUp = ({
	firstName,
	lastName,
	rdStatus,
	seatsAvailability,
	status,
	companyName,
	companyAddress,
	email,
}: UserInfo) => {
	return (
		<div>
			<div>{firstName + " " + lastName}</div>
			<div>{"Email: " + email}</div>
			<div>{rdStatus === "rider" ? "Rider" : "Driver"}</div>
			{rdStatus === "driver" && (
				<div>{"Seats Availability: " + seatsAvailability}</div>
			)}
			<div>{"Status: " + (status === "active" ? "Active" : "Inactive")}</div>
			<div>{"Company Name: " + companyName}</div>
			<div>{"Company Address: " + companyAddress}</div>
		</div>
	);
};

export default CustomPopUp;
