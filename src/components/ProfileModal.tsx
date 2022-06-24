import { Dialog, Transition } from "@headlessui/react";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { AiOutlineUser, AiOutlineClose } from "react-icons/ai";
import { auth } from "../utils/firebase/firebase.config";
import { UserInfo } from "../utils/types";
import Profile from "./Profile";

const ProfileModal: React.FC<{ userInfo: UserInfo; user: User }> = ({
	userInfo,
	user,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const { push } = useRouter();

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}

	const onLogout = () => {
		auth.signOut();
		push("/auth");
	};

	return (
		<>
			<button
				type="button"
				onClick={openModal}
				className="absolute flex items-center justify-center rounded-full bg-gray-400 z-10 right-2 top-2 p-2"
			>
				<AiOutlineUser className="w-8 h-8" />
			</button>

			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={closeModal}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<div className="flex items-start justify-between">
										<Dialog.Title
											as="h3"
											className="text-lg font-bold leading-6 text-gray-900"
										>
											Profile Page
										</Dialog.Title>
										<button type="button" className="p-2" onClick={closeModal}>
											<AiOutlineClose className="w-4 h-4" />
										</button>
									</div>
									<Profile userInfo={userInfo} user={user} />
									<div className="flex justify-center mt-4 mb-4">
										<hr className="w-full h-px bg-black text-black" />
									</div>
									<button
										onClick={onLogout}
										className="w-full rounded text-center bg-white border border-gray-300 px-3 py-2 hover:bg-gray-100"
									>
										Sign Out
									</button>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};

export default ProfileModal;
