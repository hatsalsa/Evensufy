import {
	Tooltip,
	Button,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@nextui-org/react";
import { DeleteIcon } from "../assets/DeleteIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { deleteSub, subscribe, test } from "@/utils/actions";
import toast, { Toaster } from "react-hot-toast";

export default function DeleteButton({
	login_name,
	disabled,
}: {
	login_name: string;
	disabled: boolean;
}) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const handleOpen = () => {
		onOpen();
	};
	const handleAction = async (streamer: string) => {
		{
			disabled
				? await toast.promise(deleteSub(streamer), {
						loading: "Unsubscribing streamer...",
						success: (response) => response,
						error: (error) => error.message,
				  })
				: await toast.promise(subscribe(streamer), {
						loading: "Resubscribing streamer...",
						success: (response) => response,
						error: (error) => error.message,
				  });
		}
		onClose();
	};
	return (
		<>
			<Toaster
				position="top-right"
				containerStyle={{
					top: "80px",
				}}
				reverseOrder={false}
			/>
			<Tooltip
				color={disabled ? "danger" : "success"}
				content={disabled ? "Unsubscribe" : "Resubscribe"}>
				<Button
					size="sm"
					variant="light"
					onPress={handleOpen}
					className="text-lg text-danger cursor-pointer active:opacity-50 flex justify-center align-middle">
					{disabled ? (
						<DeleteIcon />
					) : (
						<FontAwesomeIcon icon={faCirclePlus} style={{ color: "#17c964" }} />
					)}
				</Button>
			</Tooltip>
			<Modal
				backdrop="opaque"
				isOpen={isOpen}
				onClose={onClose}
				classNames={{
					backdrop:
						"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
				}}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								{disabled ? "Delete Subscribtion" : "Resubscribe Streamer"}
							</ModalHeader>
							<ModalBody>
								{disabled ? (
									<h2>Are you sure you want to delete this subscription</h2>
								) : (
									<h2>Are you sure you want to resubscribe to this user?</h2>
								)}
							</ModalBody>
							<ModalFooter>
								<Button color="primary" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button
									className={`${disabled ? "bg-red-600" : "bg-[#17c964]"}`}
									onPress={() => {
										handleAction(login_name);
									}}>
									{disabled ? "Delete" : "Resubscribe"}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
