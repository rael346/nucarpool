import { Combobox, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { Feature, FeatureCollection } from "geojson";
import { debounce } from "lodash";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Header from "../components/Header";
import Spinner from "../components/Spinner";
import { db } from "../utils/firebase/firebase.config";
import { OnboardingFormInputs } from "../utils/types";
import { onboardSchema } from "../utils/zodSchema";
import useUser from "./hooks/useUser";

const Onboarding: NextPage = () => {
	const { user, checkingStatus } = useUser();
	const router = useRouter();
	const {
		register,
		formState: { errors, isSubmitting },
		watch,
		handleSubmit,
	} = useForm<OnboardingFormInputs>({
		mode: "onBlur",
		defaultValues: {
			firstName: "",
			lastName: "",
			rdStatus: "rider",
			seatsAvailability: 0,
			companyName: "",
			companyAddress: "",
		},
		resolver: zodResolver(onboardSchema),
	});

	const [suggestions, setSuggestions] = useState<Feature[]>([]);
	const [selected, setSelected] = useState({ place_name: "" });

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

			const userInfo = {
				...values,
				companyCoord: coord,
				email: user!.email,
				seatsAvailability:
					values.rdStatus === "rider" ? 0 : values.seatsAvailability,
				status: "active",
			};

			await setDoc(doc(db, "users", user!.uid!), userInfo);
			router.push("/");
		} catch (error) {
			console.log(error);
		}
	};

	if (checkingStatus) {
		return <Spinner />;
	}

	return (
		<div className="flex h-screen items-center justify-center bg-gray-100">
			<div className="rounded-2xl w-fit bg-white flex flex-col justify-center items-center p-6 m-4 space-y-4 drop-shadow-lg">
				<Header />
				<h1 className="font-bold text-2xl mb-4">Personal Info</h1>
				<form
					className="flex flex-col space-y-4"
					onSubmit={handleSubmit(onSubmit)}
				>
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
									errors.seatsAvailability
										? "border-red-500"
										: "border-gray-300"
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
			</div>
		</div>
	);
};

export default Onboarding;
