"use client";

import { Tabs, Tab } from "@nextui-org/react";
import StreamCard from "./StreamCard";
import ActionTab from "./ActionTab";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Suspense, use, useCallback, useEffect, useState } from "react";
import type { streamStatus } from "@/utils/types";
import StreamerTab from "./StreamerTab";
import Loading from "../subscriptions/loading";
import times from "@/utils/dontgetpublished/timeout";

type StreamerData = {
	live: boolean;
	streamerName: string;
	title: string | null;
	profileImage: string;
};

export default function SubscriptionsTab({
	streamerData,
}: {
	streamerData: any;
}) {
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
	return (
		<>
			<div className="flex flex-col justify-center align-middle">
				<Tabs
					color="secondary"
					classNames={{ cursor: "bg-violet-800" }}
					className="z-40 justify-center align-middle">
					<Tab key="card" title="Subscriptions">
						<StreamerTab streamerData={streamerData} />
					</Tab>
					<Tab
						key="actions"
						title="Actions"
						className="flex justify-center align-middle">
						<ActionTab streamerData={streamerData} />
					</Tab>
				</Tabs>
			</div>
		</>
	);
}
