import Image from "next/image";
import React from "react";
import Logo from "../public/logo.png";

const Header = () => {
	return (
		<div className="flex flex-row items-center justify-center">
			<Image
				src={Logo}
				alt="Northeastern Logo"
				width={"100px"}
				height={"100px"}
			/>
			<h1 className="font-bold text-4xl">NU Carpool</h1>
		</div>
	);
};

export default Header;
