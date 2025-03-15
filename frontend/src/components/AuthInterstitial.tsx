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
	const handleLogin = async () => {
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});
			if (!response.ok) {
				// TODO: Handle login error
				console.error('Login failed');
				return;
			}
			const data = await response.json();
			// TODO: Handle successful login
			console.log('Login successful', data);
		} catch (error) {
			// TODO: Handle network error
			console.error('Network error', error);
		}
	};

	const handleRegister = async () => {
		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password, age, fitnessGoal }),
			});
			if (!response.ok) {
				// TODO: Handle registration error
				console.error('Registration failed');
				return;
			}
			const data = await response.json();
			// TODO: Handle successful registration
			console.log('Registration successful', data);
		} catch (error) {
			// TODO: Handle network error
			console.error('Network error', error);
		}
	};

	const handleGoogleLogin = () => {
		window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile`;
	};

	const handleAppleLogin = () => {
		window.location.href = `https://appleid.apple.com/auth/authorize?client_id=${APPLE_CLIENT_ID}&redirect_uri=${APPLE_REDIRECT_URI}&response_type=code&scope=name%20email`;
	};

	const handleFacebookLogin = () => {
		window.location.href = `https://www.facebook.com/v15.0/dialog/oauth?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${FACEBOOK_REDIRECT_URI}&scope=email,public_profile`;
	};

	const handleGoogleRegister = () => {
		window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile`;
	};

	const handleAppleRegister = () => {
		window.location.href = `https://appleid.apple.com/auth/authorize?client_id=${APPLE_CLIENT_ID}&redirect_uri=${APPLE_REDIRECT_URI}&response_type=code&scope=name%20email`;
	};

	const handleFacebookRegister = () => {
		window.location.href = `https://www.facebook.com/v15.0/dialog/oauth?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${FACEBOOK_REDIRECT_URI}&scope=email,public_profile`;
	};

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
						<GoogleLoginButton label="Login with Google" onClick={handleGoogleLogin} />
						<AppleLoginButton label="Login with Apple" onClick={handleAppleLogin} />
						<FacebookLoginButton label="Login with Facebook" onClick={handleFacebookLogin} />

						<Button className="mt-2" onClick={handleLogin}>Login</Button>
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
							<GoogleLoginButton label="" onClick={handleGoogleRegister} />
							<AppleLoginButton label="" onClick={handleAppleRegister} />
							<FacebookLoginButton label="" onClick={handleFacebookRegister} />
						</div>

						<Button className="mt-2" disabled={!isEmailValid || !isPasswordValid} onClick={handleRegister}>Register</Button>
					</div>
				)}

			</DialogContent>
		</Dialog>
	);
};

export default AuthInterstitial;
