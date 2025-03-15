import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { GoogleLoginButton, AppleLoginButton, FacebookLoginButton } from "./SocialAuthButtons";

interface AuthInterstitialProps {
	open: boolean;
	onClose: () => void;
}

const AuthInterstitial: React.FC<AuthInterstitialProps> = ({ open, onClose }) => {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailTouched, setEmailTouched] = useState(false);
	const [passwordTouched, setPasswordTouched] = useState(false);
	const [age, setAge] = useState("");
	const [fitnessGoal, setFitnessGoal] = useState("demo");

	const isEmailValid = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+/.test(email);
	const isPasswordValid = password.trim().length > 0;

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{isLogin ? "Login" : "Register"}</DialogTitle>
					<DialogDescription>
						{isLogin ? (
							<>
								Don't have an account?{" "}
								<button className="underline" onClick={() => setIsLogin(false)}>
									Register
								</button>
							</>
						) : (
							<>
								Already have an account?{" "}
								<button className="underline" onClick={() => setIsLogin(true)}>
									Login
								</button>
							</>
						)}
					</DialogDescription>
				</DialogHeader>

				{isLogin ? (
					<div className="grid gap-4 py-4">

						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" placeholder="Email" required />
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input id="password" type="password" placeholder="Password" required />
						</div>

						<div className="relative my-4">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									OR
								</span>
							</div>
						</div>

						{/* Social Login Buttons */}
						<GoogleLoginButton label="Login with Google" />
						<AppleLoginButton label="Login with Apple" />
						<FacebookLoginButton label="Login with Facebook" />

						<Button className="mt-2">Login</Button>
					</div>
				) : (
					<div className="grid gap-4 py-4">

						{/* Email Field with Validation */}
						<div className="grid gap-2">
							<Label htmlFor="email">Email {!isEmailValid && <span className={emailTouched ? "text-red-500" : "text-gray-400 text-sm"}> - Required</span>}</Label>
							<Input
								id="email"
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								onBlur={() => setEmailTouched(true)}
								className={!isEmailValid && emailTouched ? "border-red-500 focus:ring-red-500" : ""}
							/>
						</div>

						{/* Password Field with Validation */}
						<div className="grid gap-2">
							<Label htmlFor="password">Password {!isPasswordValid && <span className={passwordTouched ? "text-red-500" : "text-gray-400 text-sm"}> - Required</span>}</Label>
							<Input
								id="password"
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								onBlur={() => setPasswordTouched(true)}
								className={!isPasswordValid && passwordTouched ? "border-red-500 focus:ring-red-500" : ""}
							/>
						</div>

						{/* Name Field */}
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="first-name">First Name</Label>
								<Input id="first-name" type="text" placeholder="First Name" />
							</div>
							<div className="grid gap-2">
								<Label htmlFor="last-name">Last Name</Label>
								<Input id="last-name" type="text" placeholder="Last Name" />
							</div>
						</div>

						{/* Age Field */}
						<div className="grid gap-2">
							<Label htmlFor="age">Age</Label>
							<Input
								id="age"
								type="number"
								placeholder="Age"
								value={age}
								onChange={(e) => setAge(e.target.value)}
							/>
						</div>

						{/* Fitness Goals Dropdown */}
						<div className="grid gap-2">
							<Label htmlFor="fitness-goals">Fitness Goals</Label>
							<select
								id="fitness-goals"
								className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
								value={fitnessGoal}
								onChange={(e) => setFitnessGoal(e.target.value)}
							>
								<option value="demo">Just Trying It Out</option>
								<option value="weight-loss">Weight Loss</option>
								<option value="muscle-gain">Muscle Gain</option>
								<option value="improved-fitness">Improved Fitness</option>
								<option value="general-health">General Health</option>
							</select>
						</div>

						{/* Divider */}
						<div className="relative my-4">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									Or sign up with social
								</span>
							</div>
						</div>

						{/* Social Sign-up Buttons */}
						<div className="flex items-center justify-center gap-3">
							<GoogleLoginButton label="" />
							<AppleLoginButton label="" />
							<FacebookLoginButton label="" />
						</div>

						<Button className="mt-2" disabled={!isEmailValid || !isPasswordValid}>Register</Button>
					</div>
				)}

			</DialogContent>
		</Dialog>
	);
};

export default AuthInterstitial;