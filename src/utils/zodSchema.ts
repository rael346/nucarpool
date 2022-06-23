import { z } from "zod";

export const onboardSchema = z.object({
	firstName: z.string().min(1, "Cannot be empty"),
	lastName: z.string().min(1, "Cannot be empty"),
	rdStatus: z.string().min(1, "Cannot be empty"),
	seatsAvailability: z
		.number({ invalid_type_error: "Cannot be empty" })
		.int("Must be an integer")
		.nonnegative("Must be greater or equal to 0"),
	companyName: z.string().min(1, "Cannot be empty"),
	companyAddress: z.string().min(1, "Cannot be empty"),
});
