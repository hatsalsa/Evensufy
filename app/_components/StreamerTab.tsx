import { motion } from "framer-motion";
import StreamCard from "./StreamCard";
export default function StreamerTab({ streamerData }: { streamerData: any }) {
	const subscribedStreamers = streamerData.filter(
		(data: any) => data.subscribed,
	);

	if (subscribedStreamers.length === 0) {
		return (
			<motion.div
				animate={{ opacity: 1 }}
				initial={{ opacity: 0 }}
				transition={{ duration: 0.5 }}
				className="flex align-middle flex-col justify-center center min-h-[50vh] gap-y-[10px] t text-xl font-bold">
				<p>No Subscriptions</p>
			</motion.div>
		);
	}

	return (
		<div className="flex align-middle flex-col justify-center center min-h-[50vh] gap-y-[10px] ">
			{subscribedStreamers.map((data: any, index: any) => (
				<StreamCard
					key={index}
					isLive={data.stream_status}
					streamerName={data.login_name}
					title={data.title}
					profileImage={data.profile_image}
					createdAt={data.created_at}
					subscriptionStatus={data.subscribed}
				/>
			))}
		</div>
	);
}
