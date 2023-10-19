import times from "@/utils/dontgetpublished/timeout";

export default async function Compose({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className=" grid grid-flow-row gap-2">
			<>
				<div className="flex justify-center items-center pt-10 h-20">
					<h1 className="text-3xl font-bold">SUBSCRIPTIONS</h1>
				</div>
				{children}
			</>
		</div>
	);
}
