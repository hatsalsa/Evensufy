import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SubscriptionsTab from "../_components/SubscriptionsTab";


export const dynamic = "force-dynamic";
export default async function SubscriptionPage() {
	const supabase = createServerComponentClient({ cookies });

	const {
		data: { session },
	} = await supabase.auth.getSession();
	if (!session) {
		redirect("/unathenticated");
	}
	const data = await supabase.from("streamers").select("*");

	const { data: StreamerData } = data;

	return (
		<>
			<SubscriptionsTab streamerData={StreamerData} />
		</>
	);
}
