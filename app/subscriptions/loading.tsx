import { Card } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
export default async function Loading() {
	return (
		<div className="flex flex-col justify-center actionb gap-[10px] pt-[10px]">
			<div className="w-[204px]  p-[4px] justify-start rounded-md flex  bg-zinc-900">
				<div className="w-[114px] h-[32px] flex justify-center actionb  rounded-md">
					<Skeleton className=" h-[32px] w-[114px] rounded-md" />
				</div>
			</div>
			<div className="flex flex-col gap-[10px] pt-[12px]">
				<div className="w-[350px] sm:w-[480px]  h-[87px] flex justify-center p-[4px] align-middle rounded-md bg-zinc-900">
					<Skeleton className=" w-[350px] sm:w-[476px]  h-[80px] rounded-md"></Skeleton>
				</div>
				<div className="w-[350px] sm:w-[480px]  h-[87px] flex justify-center p-[4px] align-middle rounded-md bg-zinc-900">
					<Skeleton className="w-[350px] sm:w-[476px]  h-[80px] rounded-md"></Skeleton>
				</div>
				<div className="w-[350px] sm:w-[480px]  h-[87px] flex justify-center p-[4px] align-middle rounded-md bg-zinc-900">
					<Skeleton className="w-[350px] sm:w-[476px]  h-[80px] rounded-md"></Skeleton>
				</div>
				<div className="w-[350px] sm:w-[480px]  h-[87px] flex justify-center p-[4px] align-middle rounded-md bg-zinc-900">
					<Skeleton className="w-[350px] sm:w-[476px]  h-[80px] rounded-md"></Skeleton>
				</div>{" "}
				<div className="w-[350px] sm:w-[480px]  h-[87px] flex justify-center p-[4px] align-middle rounded-md bg-zinc-900">
					<Skeleton className="w-[350px] sm:w-[476px]  h-[80px] rounded-md"></Skeleton>
				</div>
			</div>
		</div>
	);
}
