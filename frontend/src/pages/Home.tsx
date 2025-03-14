import React from "react";
import { Link } from "react-router-dom";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../components/ui/dialog"
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Calendar } from "../components/ui/calendar";

const Home: React.FC = () => {
	const [date, setDate] = React.useState<Date | undefined>(new Date())

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
			<h1 className="text-4xl font-bold text-blue-600">Welcome to My Fitness App</h1>
			<p className="text-lg text-gray-700 mt-2">Track your workouts and progress with ease.</p>
			<Link to="/about" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
				Go to About Page
			</Link>

			<Link to="/login" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
				Go to Login Page
			</Link>

			<Input />

			<Dialog>
				<DialogTrigger asChild>
					<Button variant="outline">Edit Profile</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px] bg-gray-300">
					<DialogHeader>
						<DialogTitle>Edit profile</DialogTitle>
						<DialogDescription>
							Make changes to your profile here. Click save when you're done.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Name
							</Label>
							<Input id="name" value="Pedro Duarte" className="col-span-3" />
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="username" className="text-right">
								Username
							</Label>
							<Input id="username" value="@peduarte" className="col-span-3" />
						</div>
					</div>
					<DialogFooter>
						<Button type="submit">Save changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Calendar
				mode="single"
				selected={date}
				onSelect={setDate}
				className="rounded-md border"
			/>

		</div>
	);
};

export default Home;