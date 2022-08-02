import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "../server/router";
import { NextPageWithAuthAndLayout } from "../utils/types";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<SessionProvider session={session} refetchOnWindowFocus={false}>
			<Component {...pageProps} />
			<ToastContainer />
		</SessionProvider>
	);
}

export default MyApp;
