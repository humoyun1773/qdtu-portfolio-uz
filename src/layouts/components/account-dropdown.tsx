import defaultAvatar from "@/assets/images/background/placeholder.svg";
import { useUser } from "@/hooks/user/useUser";
import { useRouter } from "@/routes/hooks";
import { useUserActions } from "@/store/userStore";
import { Button } from "@/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuItem,
} from "@/ui/dropdown-menu";

export default function AccountDropdown() {
	const { replace } = useRouter();
	const { clearUserInfoAndToken } = useUserActions();
	const { data: user } = useUser();

	const avatar = user?.imageUrl || defaultAvatar;

	const logout = () => {
		try {
			clearUserInfoAndToken();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="rounded-full">
					<img className="h-6 w-6 rounded-full object-cover" src={avatar} alt="" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<div className="flex items-center gap-2 p-2">
					<img className="h-10 w-10 rounded-full object-cover" src={avatar} alt="" />
					<div className="flex flex-col items-start">
						<div className="text-text-primary text-sm font-medium">{user?.fullName}</div>
						<div className="text-text-secondary text-xs">{user?.phone}</div>
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="font-bold text-warning" onClick={logout}>
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
