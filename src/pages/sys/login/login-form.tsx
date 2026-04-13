import useLogin from "@/hooks/auth/useLogin";
import { Button } from "@/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import { cn } from "@/utils";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

type SignInForm = {
	phone: string;
	password: string;
};

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
	const login = useLogin();

	const form = useForm<SignInForm>({
		defaultValues: {
			phone: "",
			password: "",
		},
	});

	const handleFinish = (values: SignInForm) => {
		login.mutate({
			phone: values.phone,
			password: values.password,
		});
	};

	return (
		<div className={cn("flex flex-col gap-8", className)}>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-4xl font-bold">Kirish</h1>
				<p className="text-muted-foreground text-base">Kirish uchun (ID/raqam) va parolingizni kiriting</p>
			</div>

			<Form {...form} {...props}>
				<form onSubmit={form.handleSubmit(handleFinish)} className="space-y-6">
					<FormField
						control={form.control}
						name="phone"
						rules={{ required: "Username is required" }}
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-base">ID/phone</FormLabel>
								<FormControl>
									<Input placeholder="Username" className="h-14 text-base px-4 rounded-lg" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						rules={{ required: "Password is required" }}
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-base">Parol</FormLabel>
								<FormControl>
									<Input type="password" placeholder="Password" className="h-14 text-base px-4 rounded-lg" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={login.isPending} className="cursor-pointer w-full h-14 text-base rounded-lg">
						{login.isPending && <Loader2 className="animate-spin mr-2" />}
						Sign In
					</Button>
				</form>
			</Form>
		</div>
	);
}

export default LoginForm;
