import React from "react";
import { UserInfo } from "../utils/types";
import { FaRegBuilding } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

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
		<div className="flex flex-col space-y-2">
			<div className="font-bold text-base">{firstName + " " + lastName}</div>
			<div className="flex flex-row space-x-2">
				<div
					className={`text-xs rounded-full py-1 px-3 ${
						status === "active"
							? "bg-indigo-200 text-indigo-800"
							: "bg-gray-200 text-gray-800"
					} `}
				>
					{status === "active" ? "Active" : "Inactive"}
				</div>
				<div
					className={`text-xs rounded-full py-1 px-3 ${
						rdStatus === "rider"
							? "bg-sky-200 text-sky-800"
							: "bg-orange-200 text-orange-800"
					} `}
				>
					{rdStatus === "rider" ? "Rider" : "Driver"}
				</div>
				{rdStatus === "driver" && (
					<div className="text-xs rounded-full py-1 px-3 bg-emerald-200 text-emerald-800">
						{seatsAvailability +
							" " +
							(seatsAvailability > 1 ? "seats" : "seat")}
					</div>
				)}
			</div>
			{status === "active" && (
				<div className="space-y-2">
					<div className="flex items-center space-x-2">
						<div className="flex justify-center items-center shadow-md p-2 border border-gray-500 rounded-md">
							<FiMail className="w-4 h-4" />
						</div>
						<span>{email}</span>
					</div>
					<div className="flex items-start space-x-2">
						<div className="flex justify-center items-center shadow-md p-2 border border-gray-500 rounded-md">
							<FaRegBuilding className="w-4 h-4" />
						</div>
						<div>
							<div className="font-medium">{companyName}</div>
							<div className="text-xs">{companyAddress}</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CustomPopUp;
