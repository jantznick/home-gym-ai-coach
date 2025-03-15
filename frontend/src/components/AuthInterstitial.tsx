import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "../utils/shadcn";

interface AuthInterstitialProps {
  open: boolean;
  onClose: () => void;
}

const AuthInterstitial: React.FC<AuthInterstitialProps> = ({ open, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isLogin ? "Login" : "Register"}</DialogTitle>
          <DialogDescription>
            {isLogin
              ? "Login to access your account"
              : "Create an account to get started"}
          </DialogDescription>
        </DialogHeader>
        {isLogin ? (
          <div className="grid gap-4 py-4">
            <Button variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />
                <path d="m22 7-8.97 8.18a1 1 0 0 1-1.06 0L2 7" />
              </svg>
              Login with Google
            </Button>
            <Button variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M7.67 14.5h.01M12 14.5h.01M16.33 14.5h.01M12 1.5c-3.14 0-5.71 2.09-6.54 5.08A9.84 9.84 0 0 0 1.5 12c0 3.14 2.09 5.71 5.08 6.54A9.84 9.84 0 0 0 12 22.5c3.14 0 5.71-2.09 6.54-5.08A9.84 9.84 0 0 0 22.5 12c0-3.14-2.09-5.71-5.08-6.54A9.84 9.84 0 0 0 12 1.5Z" />
              </svg>
              Login with Apple
            </Button>
            <Button variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              Login with Facebook
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Email" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Password" />
            </div>
            <Button>Login</Button>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Email" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="Name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="Age" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight">Weight</Label>
              <Input id="weight" type="number" placeholder="Weight" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fitness-goals">Fitness Goals</Label>
              <select
                id="fitness-goals"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="weight-loss">Weight Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="improved-fitness">Improved Fitness</option>
                <option value="general-health">General Health</option>
              </select>
            </div>
            <Button>Register</Button>
          </div>
        )}
        <div className="py-2 text-sm text-muted-foreground">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <button
                className="underline underline-offset-4 hover:text-primary"
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="underline underline-offset-4 hover:text-primary"
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthInterstitial;
