import React from "react";
import { FieldError } from "react-hook-form";
import { classNames } from "../utils/classNames";

type RadioOwnProps = {
	label?: string;
	error?: FieldError;
};

type RadioProps = RadioOwnProps & React.ComponentPropsWithoutRef<"input">;

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
	({ label, id, name, error, className, ...rest }, forwardedRef) => {
		return (
			<div>
				<div className="flex space-x-2 items-center">
					<input
						{...rest}
						ref={forwardedRef}
						id={id}
						name={name}
						type="radio"
						className={classNames("form-radio", className)}
					/>
					{label && (
						<label htmlFor={id} className="text-sm">
							{label}
						</label>
					)}
				</div>
				{error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
			</div>
		);
	}
);

Radio.displayName = "Radio";

export default Radio;
