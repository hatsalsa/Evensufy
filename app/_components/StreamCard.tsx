"use client";
import { Card, CardBody } from "@nextui-org/card";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { CardType } from "@/utils/types";
import { motion } from "framer-motion";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
const show = {
	opacity: 0,
	transitionEnd: {
		display: "none",
	},
};

const hide = {
	opacity: 1,
	display: "flex",

	transition: { duration: 0.5 },
};

export default function StreamCard({
	streamerName,
	title,
	profileImage,
	isLive,
	createdAt,
	subscriptionStatus,
}: CardType) {
	const createdTime = new Date(createdAt).toLocaleDateString("en-US");

	const [isCardOpen, setCardOpen] = useState(true);

	const router = useRouter();
	const supabase = createClientComponentClient();

	useEffect(() => {
		const streamers = supabase
			.channel("custom-all-channel")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "streamers" },
				() => {
					router.refresh();
				},
			)
			.subscribe();
		return () => {
			supabase.removeChannel(streamers);
		};
	}, [supabase, router]);
	const toggleCard = useCallback(() => {
		setCardOpen(!isCardOpen);
	}, [isCardOpen]);
	return (
		<>
			<motion.div
				animate={{ opacity: 1 }}
				initial={{ opacity: 0 }}
				transition={{ duration: 0.8 }}
				className="flex justify-center align-middle">
				<Card
					isPressable
					onPress={toggleCard}
					className={`z-40 bg-neutral-900/60 border-none opencard sm:w-[593px] w-[350px] items-center ${
						isCardOpen
							? "h-[87px] sm:h-[87px]"
							: "h-[243px] transition-all duration-700 ease-in-out delay-2000"
					}`}
					shadow="sm">
					<CardBody className=" p-[0.78rem] flex overflow-x-hidden overflow-y-hidden ">
						<div className="flex gap-x-4 justify-evenly ">
							<Image
								className={`rounded-[10px]  ${isLive ? "grayscale-0" : "grayscale"}`}
								src={profileImage}
								width={62}
								height={62}
								alt=""
							/>
							<div className=" flex-grow">
								<div className="text-[18px]">{streamerName}</div>
								<div className="text-[1rem]">{title}</div>
							</div>
							<div className=" flex items-center px-1 h-full">
								<div
									className={`bg-[#FF4343]  px-[15px] rounded-sm  ${
										isLive ? "grayscale-0" : "grayscale"
									}`}>
									{isLive ? "LIVE" : "OFFLINE"}
								</div>
							</div>
						</div>
						<motion.div
							initial={{ opacity: 0 }}
							animate={isCardOpen ? show : hide}
							className=" align-middle justify-center h-full ">
							<div className="inline-flex justify-center align-middle gap-10">
								<div className="flex flex-col gap-y-1 justify-center items-center">
									<div>Status</div>
									<div>{streamerName ? "Subscribed" : "Not Subscribed"}</div>
								</div>
								<div className="flex flex-col gap-y-1 justify-center items-center">
									<div>Created At</div>
									<div>{createdTime}</div>
								</div>
								<div className="flex flex-col gap-y-1 justify-center items-center">
									<div>Type</div>
									<div className="flex-col sm:flex sm:flex-row leading-tight">
										<span>Online</span>
										<span className="sm:flex hidden items-center sm:px-2">|</span>
										<span className="sm:hidden flex items-center justify-center pb-[4px] leading-[8px]">
											____
										</span>
										<span className="pt-[10px] flex sm:pt-0">Offline</span>
									</div>
								</div>
							</div>
						</motion.div>
					</CardBody>
				</Card>
			</motion.div>
		</>
	);
}
