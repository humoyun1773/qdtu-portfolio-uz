import CyanBlur from "@/assets/images/background/cyan-blur.png";
import RedBlur from "@/assets/images/background/red-blur.png";
import { AvatarGroup } from "@/components/avatar-group";
import { Icon } from "@/components/icon";
import { Avatar, AvatarFallback } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { ScrollArea } from "@/ui/scroll-area";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Text } from "@/ui/typography";
import { type CSSProperties, useState } from "react";

export default function NoticeButton() {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [count, setCount] = useState(0);

	const style: CSSProperties = {
		backdropFilter: "blur(20px)",
		backgroundImage: `url("${CyanBlur}"), url("${RedBlur}")`,
		backgroundRepeat: "no-repeat, no-repeat",
		backgroundPosition: "right top, left bottom",
		backgroundSize: "50%, 50%",
	};

	return (
		<>
			<div className="relative" onClick={() => setDrawerOpen(true)}>
				<Button variant="ghost" size="icon" className="rounded-full" onClick={() => setDrawerOpen(true)}>
					<Icon icon="solar:bell-bing-bold-duotone" size={24} />
				</Button>
				<Badge variant="destructive" shape="circle" className="absolute -right-2 -top-2">
					{count}
				</Badge>
			</div>
			<Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
				<SheetContent side="right" className="sm:max-w-md p-0 [&>button]:hidden flex flex-col" style={style}>
					<SheetHeader className="flex flex-row items-center justify-between p-4 h-16 shrink-0">
						<SheetTitle>Notifications</SheetTitle>
						<Button
							variant="ghost"
							size="icon"
							className="rounded-full text-primary"
							onClick={() => {
								setCount(0);
								setDrawerOpen(false);
							}}
						>
							<Icon icon="solar:check-read-broken" size={20} />
						</Button>
					</SheetHeader>
					<div className="px-4 flex-1 overflow-hidden">
						<NoticeTab />
					</div>
					<SheetFooter className="flex flex-row h-16 w-full items-center justify-between p-4 shrink-0">
						<Button variant="outline" className="flex-1 mr-2">
							Archive all
						</Button>
						<Button className="flex-1 ml-2">Mark all as read</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</>
	);
}

function NoticeTab() {
	const allNotifications: any[] = [];
	const inboxNotifications: any[] = [];
	const teamNotifications: any[] = [];

	const renderNotification = (notification: any) => {
		const getFileIcon = (type: string) => {
			switch (type) {
				case "ppt":
					return "local:file-ppt";
				case "excel":
					return "local:file-excel";
				case "word":
					return "local:file-word";
				case "svg":
					return "local:file-img";
				case "figma":
					return "local:file-psd";
				default:
					return "local:file";
			}
		};

		const getTagColor = (tag: string) => {
			switch (tag) {
				case "Client-Request":
					return "bg-purple-100 text-purple-700";
				case "Figma":
					return "bg-orange-100 text-orange-700";
				case "Redesign":
					return "bg-gray-100 text-gray-700";
				case "Improvement":
					return "bg-green-100 text-green-700";
				case "Bug":
					return "bg-red-100 text-red-700";
				default:
					return "bg-gray-100 text-gray-700";
			}
		};

		return (
			<div key={notification.id} className="flex items-start space-x-3 py-4 border-b border-border last:border-b-0">
				{notification.hasAvatar ? (
					<div className="relative">
						<div className="w-10 h-10 rounded-full bg-bg-neutral flex items-center justify-center text-sm font-medium">
							CH
						</div>
						<div className="absolute bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2" />
					</div>
				) : notification.isSuccess ? (
					<div className="w-10 h-10 rounded-full bg-bg-neutral flex items-center justify-center">
						<Badge shape="circle" variant="success">
							<Icon icon="solar:check-circle-bold" size={20} />
						</Badge>
					</div>
				) : null}

				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between">
						<div className="flex-1">
							{notification.type === "success" || notification.type === "view_allowed" ? (
								<Text>{notification.message || notification.status}</Text>
							) : (
								<Text variant="subTitle2">
									<Text variant="subTitle2">{notification.user}</Text>
									<Text variant="subTitle2" color="secondary">
										{" "}
										{notification.action}{" "}
									</Text>
									{notification.target && (
										<Text variant="subTitle2" color="primary">
											{notification.target}
										</Text>
									)}
									{notification.targetType && (
										<Text variant="subTitle2" color="secondary">
											{" "}
											{notification.targetType}
										</Text>
									)}
									{notification.targetDate && (
										<Text variant="subTitle2" color="secondary">
											{" "}
											to {notification.targetDate}
										</Text>
									)}
								</Text>
							)}
							<div className="flex items-center space-x-2 mt-1">
								<Text variant="subTitle2" color="secondary">
									{notification.time}
								</Text>
								{notification.department && (
									<>
										<Text variant="caption" color="secondary">
											•
										</Text>
										<Text variant="caption" color="secondary">
											{notification.department}
										</Text>
									</>
								)}
							</div>
						</div>
					</div>

					{/* Message */}
					{notification.message && notification.type !== "success" && (
						<div className="mt-3 p-3 bg-bg-neutral rounded-lg">
							<Text variant="caption">{notification.message}</Text>
						</div>
					)}

					{/* User Request */}
					{notification.type === "user_request" && (
						<div className="mt-3 p-3 bg-bg-neutral rounded-lg">
							<div className="flex items-center justify-between">
								<div>
									<Text variant="subTitle2">{notification.userName}</Text>
									<Text variant="caption" color="secondary">
										{notification.userEmail}
									</Text>
								</div>
								<Button variant="outline" size="sm">
									Go to profile
								</Button>
							</div>
						</div>
					)}

					{/* Meeting */}
					{notification.type === "meeting" && (
						<div className="mt-3 p-4 bg-bg-neutral rounded-lg">
							<div className="flex items-center justify-between">
								<div>
									<div className="flex items-center space-x-4">
										<div className="text-center">
											<Badge variant="warning">{notification.meetingDate.split(" ")[0]}</Badge>
											<div className="text-lg font-bold mt-1">
												<Text variant="subTitle2">{notification.meetingDate.split(" ")[1]}</Text>
											</div>
										</div>
										<div className="flex flex-col">
											<Text variant="subTitle2">{notification.meetingTitle}</Text>
											<Text variant="caption" color="secondary">
												{notification.meetingTime}
											</Text>
										</div>
									</div>
								</div>
								<AvatarGroup max={{ count: 4 }} size="small">
									{Array.from({ length: notification.attendees }).map((_, i) => (
										<Avatar key={`attendee-${notification.id}-${i}`}>
											<AvatarFallback>{i + 1}</AvatarFallback>
										</Avatar>
									))}
								</AvatarGroup>
							</div>
						</div>
					)}

					{/* File */}
					{notification.fileName && (
						<div className="mt-3 p-3 bg-bg-neutral rounded-lg flex items-center space-x-3">
							<Icon icon={getFileIcon(notification.fileType)} size={32} />
							<div className="flex-1">
								<Text variant="subTitle2">{notification.fileName}</Text>
								<Text variant="caption" color="secondary">
									{notification.fileSize}
									{notification.editedTime && ` • Edited ${notification.editedTime}`}
								</Text>
							</div>
							<Button variant="outline" size="sm">
								<Icon icon="solar:download-linear" size={16} />
							</Button>
						</div>
					)}

					{/* Multiple Files */}
					{notification.files && (
						<div className="mt-3 space-y-2">
							{notification.files.map((file: any) => (
								<div key={file.name} className="p-3 bg-bg-neutral rounded-lg flex items-center space-x-3">
									<Icon icon={getFileIcon(file.type)} size={32} />
									<div className="flex-1">
										<Text variant="subTitle2">{file.name}</Text>
										<Text variant="caption" color="secondary">
											{file.size}
										</Text>
									</div>
									<Button variant="outline" size="sm">
										<Icon icon="solar:download-linear" size={16} />
									</Button>
								</div>
							))}
						</div>
					)}

					{/* Artworks */}
					{notification.artworks && (
						<div className="mt-3 grid grid-cols-2 gap-3">
							{notification.artworks.map((artwork: any) => (
								<div key={artwork.id} className="relative">
									<div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg" />
									<div className="mt-2">
										<Text variant="subTitle2">{artwork.title}</Text>
										<Text variant="caption" color="secondary">
											Token ID: {artwork.id}
										</Text>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Tags */}
					{notification.tags && (
						<div className="mt-3 flex flex-wrap gap-2">
							{notification.tags.map((tag: string) => (
								<Badge key={tag} variant="default">
									{tag}
								</Badge>
							))}
						</div>
					)}

					{/* Task */}
					{notification.taskTitle && (
						<div className="mt-3 p-3 bg-bg-neutral rounded-lg">
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<Text variant="subTitle2">{notification.taskTitle}</Text>
									<Text variant="caption" color="secondary">
										Due Date: {notification.dueDate}
									</Text>
									<div className="flex items-center space-x-2 mt-2">
										{notification.tags?.map((tag: string) => (
											<span key={tag} className={`px-2 py-1 rounded-full text-xs ${getTagColor(tag)}`}>
												{tag}
											</span>
										))}
									</div>
								</div>
								<div className="flex -space-x-2">
									{Array.from({ length: notification.assignees }).map((_, i) => (
										<div
											key={`attendee-${notification.id}-${i}`}
											className="w-6 h-6 rounded-full bg-bg-neutral border-2"
										/>
									))}
								</div>
							</div>
						</div>
					)}

					{/* Actions */}
					{notification.hasActions && (
						<div className="mt-3 flex space-x-2">
							<Button size="sm">
								{notification.type === "access"
									? "Accept"
									: notification.type === "user_request"
										? "Accept"
										: notification.type === "meeting"
											? "Accept"
											: notification.type === "upgrade"
												? "Accept"
												: notification.type === "invitation"
													? "Accept"
													: notification.type === "edit_request"
														? "Accept"
														: "Accept"}
							</Button>
							<Button variant="outline" size="sm">
								{notification.type === "access"
									? "Decline"
									: notification.type === "user_request"
										? "Decline"
										: notification.type === "meeting"
											? "Decline"
											: notification.type === "upgrade"
												? "Decline"
												: notification.type === "invitation"
													? "Decline"
													: notification.type === "edit_request"
														? "Decline"
														: "Decline"}
							</Button>
						</div>
					)}

					{/* Reply */}
					{notification.hasReply && (
						<div className="mt-3">
							<div className="flex items-center space-x-2">
								<Input placeholder="Reply " />
								<Button variant="ghost" size="sm">
									<Icon icon="solar:gallery-linear" size={16} />
								</Button>
							</div>
						</div>
					)}

					{/* Profile Action */}
					{notification.hasProfileAction && (
						<div className="mt-3 flex items-center space-x-2">
							<div className="flex items-center space-x-2 text-sm text-gray-600">
								<Icon icon="solar:check-circle-bold" size={16} className="text-green-600" />
								<span>Connected</span>
							</div>
							<Button variant="outline" size="sm">
								Go to profile
							</Button>
						</div>
					)}
				</div>
			</div>
		);
	};

	return (
		<Tabs defaultValue="all" className="w-full h-full flex flex-col">
			<TabsList className="gap-2 w-full flex justify-between items-center shrink-0">
				<TabsTrigger value="all" className="flex items-center gap-1">
					<span>All</span>
					<Badge variant="default">{allNotifications.length}</Badge>
				</TabsTrigger>
				<TabsTrigger value="inbox" className="flex items-center gap-1">
					<span>Inbox</span>
					<Badge variant="info">{inboxNotifications.length}</Badge>
				</TabsTrigger>
				<TabsTrigger value="team" className="flex items-center gap-1">
					<span>Team</span>
					<Badge variant="success">{teamNotifications.length}</Badge>
				</TabsTrigger>
			</TabsList>

			<TabsContent value="all" className="flex-1 overflow-hidden">
				<ScrollArea className="h-full">
					<div className="space-y-0">{allNotifications.map(renderNotification)}</div>
				</ScrollArea>
			</TabsContent>

			<TabsContent value="inbox" className="flex-1 overflow-hidden">
				<ScrollArea className="h-full">
					<div className="space-y-0">{inboxNotifications.map(renderNotification)}</div>
				</ScrollArea>
			</TabsContent>

			<TabsContent value="team" className="flex-1 overflow-hidden">
				<ScrollArea className="h-full">
					<div className="space-y-0">{teamNotifications.map(renderNotification)}</div>
				</ScrollArea>
			</TabsContent>
		</Tabs>
	);
}
