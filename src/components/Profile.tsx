import { Combobox, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Feature, FeatureCollection } from "geojson";
import { debounce } from "lodash";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { db } from "../utils/firebase/firebase.config";
import {
	OnboardingFormInputs,
	ProfileFormInputs,
	UserInfo,
} from "../utils/types";
import { profileSchema } from "../utils/zodSchema";

/**
 * Note: this page is very similar to /onboarding, with small
 * difference in fields (an additional 'status' field) and the
 * onSubmit event.
 * TODO: abstract Profile and Onboarding
 */

const Profile: React.FC<{ userInfo: UserInfo; user: User }> = ({
	userInfo,
	user,
}) => {
	const {
		register,
		formState: { errors },
		watch,
		handleSubmit,
	} = useForm<ProfileFormInputs>({
		mode: "onBlur",
		defaultValues: {
			...userInfo,
		},
		resolver: zodResolver(profileSchema),
	});

	const [suggestions, setSuggestions] = useState<Feature[]>([]);
	const [selected, setSelected] = useState({
		place_name: userInfo.companyAddress,
	});

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const results: FeatureCollection = await axios
				.post("/api/geocoding", { value: e.target.value })
				.then((res) => res.data);
			setSuggestions(results.features);
		} catch (error) {
			toast.error(
				"Error fetching autocomplete options. See console for details."
			);
			console.error(error);
		}
	};

	const onSubmit = async (values: OnboardingFormInputs) => {
		try {
			const coord = (selected as any).center;

			const data = {
				...values,
				companyCoord: coord ? coord : userInfo.companyCoord,
				seatsAvailability:
					values.rdStatus === "rider" ? 0 : values.seatsAvailability,
			};

			await setDoc(doc(db, "users", user!.uid!), data);
			toast.success(
				"Updated info successful. Please refresh the page to see effect."
			);
		} catch (error) {
			console.log(error);
			toast.error("Error updating info. Please refresh the page.");
		}
	};
	return (
		<form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
			<div className="flex flex-row space-x-4">
				<div className="flex flex-col space-y-2">
					<label htmlFor="firstName" className="font-medium text-xm">
						First Name
					</label>
					<input
						id="firstName"
						className={`w-full  shadow-sm rounded-md px-3 py-2 ${
							errors.firstName ? "border-red-500" : "border-gray-300"
						}`}
						type="text"
						{...register("firstName")}
					/>
					{errors.firstName && (
						<p className="text-red-500 text-sm mt-2">
							{errors?.firstName?.message}
						</p>
					)}
				</div>

				<div className="flex flex-col space-y-2">
					<label htmlFor="lastName" className="font-medium text-xm">
						Last Name
					</label>
					<input
						id="lastName"
						className={`w-full  shadow-sm rounded-md px-3 py-2 ${
							errors.lastName ? "border-red-500" : "border-gray-300"
						}`}
						type="text"
						{...register("lastName")}
					/>
					{errors.lastName && (
						<p className="text-red-500 text-sm mt-2">
							{errors?.lastName?.message}
						</p>
					)}
				</div>
			</div>

			<div className="flex flex-col space-y-2">
				<label htmlFor="rdStatus" className="font-medium text-xm">
					Rider/Driver Status
				</label>
				<select
					id="rdStatus"
					className="border-gray-300 shadow-sm rounded-md px-3 py-2"
					{...register("rdStatus")}
				>
					<option value={"rider"}>Rider</option>
					<option value={"driver"}>Driver</option>
				</select>
			</div>

			{watch("rdStatus") == "driver" && (
				<div className="flex flex-col space-y-2">
					<label htmlFor="seatsAvail" className="font-medium text-xm">
						Seats Availability
					</label>
					<input
						id="seatsAvail"
						className={`shadow-sm rounded-md px-3 py-2 ${
							errors.seatsAvailability ? "border-red-500" : "border-gray-300"
						}`}
						type="number"
						{...register("seatsAvailability", { valueAsNumber: true })}
					/>
					{errors.seatsAvailability && (
						<p className="text-red-500 text-sm mt-2">
							{errors?.seatsAvailability?.message}
						</p>
					)}
				</div>
			)}

			<div className="flex flex-col space-y-2">
				<label htmlFor="status" className="font-medium text-xm">
					Status
				</label>
				<select
					id="status"
					className="border-gray-300 shadow-sm rounded-md px-3 py-2"
					{...register("status")}
				>
					<option value={"active"}>Active</option>
					<option value={"driver"}>Inactive</option>
				</select>
			</div>

			<div className="flex flex-col space-y-2">
				<label htmlFor="companyName" className="font-medium text-xm">
					Company Name
				</label>
				<input
					id="companyName"
					className={`w-full shadow-sm rounded-md px-3 py-2 ${
						errors.companyName ? "border-red-500" : "border-gray-300"
					}`}
					type="text"
					{...register("companyName")}
				/>
				{errors.companyName && (
					<p className="text-red-500 text-sm mt-2">
						{errors?.companyName?.message}
					</p>
				)}
			</div>

			<div className="flex flex-col space-y-2">
				<label htmlFor="companyAddress" className="font-medium text-xm">
					Company Address
				</label>
				<Combobox value={selected} onChange={setSelected}>
					<Combobox.Input
						className={`w-full shadow-sm rounded-md px-3 py-2 ${
							errors.companyAddress ? "border-red-500" : "border-gray-300"
						}`}
						displayValue={(feat: any) =>
							feat.place_name ? feat.place_name : ""
						}
						type="text"
						{...register("companyAddress")}
						onChange={debounce(handleChange, 500)}
					/>
					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Combobox.Options className="w-full rounded-md bg-white text-base shadow-lg focus:outline-none ">
							{suggestions.length === 0 ? (
								<div className="relative cursor-default select-none py-2 px-4 text-gray-700">
									Nothing found.
								</div>
							) : (
								suggestions.map((feat: any) => (
									<Combobox.Option
										key={feat.id}
										className={({ active }) =>
											`max-w-fit relative cursor-default select-none p-3 ${
												active ? "bg-blue-400 text-white" : "text-gray-900"
											}`
										}
										value={feat}
									>
										{feat.place_name}
									</Combobox.Option>
								))
							)}
						</Combobox.Options>
					</Transition>
				</Combobox>
				{errors.companyAddress && (
					<p className="text-red-500 text-sm mt-2">
						{errors?.companyAddress?.message}
					</p>
				)}
			</div>

			<button
				type="submit"
				className="w-full bg-northeastern-red hover:bg-red-800 rounded-md text-white px-3 py-2 shadow"
			>
				Submit
			</button>
		</form>
	);
};

export default Profile;
