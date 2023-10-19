import {
	Table,
	TableBody,
	TableHeader,
	TableColumn,
	TableRow,
	TableCell,
	User,
	Chip,
} from "@nextui-org/react";
import { useEffect } from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import DeleteButton from "./DeleteButton";
import _isEqual from "lodash/isEqual";
import { motion } from "framer-motion";
export default function ActionTab({ streamerData }: { streamerData: any }) {
	const router = useRouter();
	const supabase = createClientComponentClient();

	const statusKey: string[] = [];


	streamerData.forEach((data: any) => {
		if (data.subscribed === false) {
			statusKey.push(data.id);
		}
	});

	const disabledKeys = statusKey;


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
	if (streamerData.length === 0) {
		return (
			<div className="center min-h-[50vh]">
				<p className="text-lg font-bold">No streamers found</p>
			</div>
		);
	}
	return (
		<div className="center">
			<motion.div
				animate={{ opacity: 1 }}
				initial={{ opacity: 0 }}
				transition={{ duration: 0.5 }}
				className="inline-flex z-40 gap-2 align-middle justify-center min-h-[50vh] pl-2 actionb">
				<Table
					classNames={{
						wrapper: ["bg-neutral-900/60"],
						th: ["bg-transparent"],
					}}
					aria-labelledby="streamers table"
					disabledKeys={disabledKeys}>
					<TableHeader>
						<TableColumn>Name</TableColumn>
						<TableColumn>Status</TableColumn>
						<TableColumn>Action</TableColumn>
					</TableHeader>
					<TableBody className="bg-red" aria-labelledby="streamersdata">
						{streamerData?.map((data: any, index: number) => (
							<TableRow key={data.id}>
								<TableCell>
									<User
										name={data.login_name}
										className={`${statusKey?.includes(data.id) ? "grayscale" : "grayscale-0"
											}`}
										description="streamer"
										avatarProps={{
											src: data.profile_image,
										}}
									/>
								</TableCell>
								<TableCell>
									<div className="flex justify-center align-middle">
										<Chip
											isDisabled={data.subscribed ? false : true}
											color={data.subscribed ? "success" : "danger"}
											variant="flat">
											{data.subscribed ? "Active" : "Paused"}
										</Chip>
									</div>
								</TableCell>
								<TableCell>
									<DeleteButton
										disabled={data.subscribed ? true : false}
										login_name={data.login_name}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</motion.div>
		</div>
	);
}
