"use client";

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Button } from "../ui/button";
import { SignUpSchema, SignUpSchemaType } from "@/schema";
import Link from "next/link";
import { ArrowLeftIcon, MailIcon } from "lucide-react";
import Icons from "../global/icons";
import { FADE_IN_VARIANTS } from "@/constants";
import { toast } from "sonner";
import LoadingIcon from "../ui/loading-icon";
import { OAuthStrategy } from "@clerk/types";


const SignUpForm = () => {

    const router = useRouter();

    const params = useSearchParams();

    const from = params.get("from");

    const { signIn } = useSignIn();

    const { signOut } = useClerk();

    const { isLoaded, signUp, setActive } = useSignUp();

    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [isEmailOpen, setIsEmailOpen] = useState<boolean>(true);
    const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
    const [isEmailLoading, setIsEmailLoading] = useState<boolean>(false);
    const [isCodeLoading, setIsCodeLoading] = useState<boolean>(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
    const [isGithubLoading, setIsGithubLoading] = useState<boolean>(false);
    const [isLinkedinLoading, setIsLinkedinLoading] = useState<boolean>(false);

    const handleOAuth = async (strategy: OAuthStrategy) => {
        if (strategy === "oauth_google") {
            setIsGoogleLoading(true);
        }
        if (strategy === "oauth_github") {
            setIsGithubLoading(true);
        }
        if (strategy === "oauth_linkedin") {
            setIsLinkedinLoading(true);
        }

        await signOut();

        try {
            await signIn?.authenticateWithRedirect({
                strategy,
                redirectUrl: "/auth/sso-callback",
                redirectUrlComplete: "/auth/callback",
            });

            const providerName =
                strategy === "oauth_google"
                    ? "Google"
                    : strategy === "oauth_github"
                        ? "GitHub"
                        : strategy === "oauth_linkedin"
                            ? "LinkedIn"
                            : "Unknown";

            toast.loading(`Redirecting to ${providerName}...`);
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again.");
        }
    };

    const handleEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isLoaded) return;

        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        if (!username) {
            toast.error("Please enter a username");
            return;
        }

        setIsEmailLoading(true);

        try {

            await signOut();

            await signUp.create({
                emailAddress: email,
                username: username,
            });

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            setIsCodeSent(true);

            toast.success("We have sent a code to your email address");
        } catch (error: any) {
            switch (error.errors[0]?.code) {
                case "form_identifier_exists":
                    toast.error("This email is already registered. Please sign in.");
                    router.push("/auth/signin?from=signup");
                    break;
                case "form_password_pwned":
                    toast.error("The password is too common. Please choose a stronger password.");
                    break;
                case "form_param_format_invalid":
                    toast.error("Invalid email address. Please enter a valid email address.");
                    break;
                case "form_password_length_too_short":
                    toast.error("Password is too short. Please choose a longer password.");
                    break;
                default:
                    toast.error("An error occurred. Please try again");
                    break;
            }
        } finally {
            setIsEmailLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isLoaded) return;

        if (!code) {
            toast.error("Please enter the code");
            return;
        }

        setIsCodeLoading(true);

        try {
            const completeSignup = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignup.status === "complete") {
                await setActive({ session: completeSignup.createdSessionId });
                router.push("/auth/callback");
            } else {
                console.error(JSON.stringify(completeSignup, null, 2));
                toast.error("Invalid verification code. Please try again.");
            }
        } catch (error) {
            console.error("Error:", JSON.stringify(error, null, 2));
            toast.error("An error occurred. Please try again");
        } finally {
            setIsCodeLoading(false);
        }

        // Check if the code is correct or not
        // If code is correct, then show create password form
        // If code is incorrect, then show error message
    };

    useEffect(() => {
        if (from) {
            setIsEmailOpen(false);
        }
    }, [from]);

    return (
        <div className="flex flex-col text-center text-white w-full pt-5 sm:w-[60%]">
            <motion.div
                variants={FADE_IN_VARIANTS}
                animate="visible"
                initial="hidden"
            >
                <div className="flex justify-center">
                    <Link href="/">
                        <h2 className="flex justify-center text-2xl font-semibold pb-6 border-b border-border">
                            Proje<span className="text-transparent font-bold bg-gradient-to-br from-purple-700 to-blue-400 bg-clip-text">X</span>pert
                        </h2>
                    </Link>
                </div>
                <h1 className="text-2xl text-center mt-4">
                    {isEmailOpen
                        ? "Create your account"
                        : isCodeSent ? "Check your email"
                            : "Enter your email and username"}
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                    {isEmailOpen
                        ? "Create an account to start using luro"
                        : isCodeSent
                            ? "Please check your inbox for verification code"
                            : "Enter your email address to get started"}
                </p>
            </motion.div>
            {isEmailOpen ? (
                <div>
                    <motion.div
                        variants={FADE_IN_VARIANTS}
                        animate="visible"
                        initial="hidden"
                        className="flex flex-col gap-4 py-8"
                    >
                        <div className="w-full">
                            <Button
                                size="lg"
                                type="button"
                                variant="tertiary"
                                disabled={isGoogleLoading || isGithubLoading || isLinkedinLoading}
                                onClick={() => handleOAuth("oauth_google")}
                                className="w-full"
                            >
                                {isGoogleLoading ? <LoadingIcon size="sm" className="w-4 h-4 absolute left-4" /> : <Icons.google className="w-4 h-4 absolute left-4" />}
                                Continue with Google
                            </Button>
                        </div>
                        <div className="w-full">
                            <Button
                                size="lg"
                                type="button"
                                disabled={isGoogleLoading || isGithubLoading || isLinkedinLoading || isEmailLoading}
                                onClick={() => handleOAuth("oauth_github")}
                                variant="tertiary"
                                className="w-full"
                            >
                                {isGithubLoading ? <LoadingIcon size="sm" className="w-4 h-4 absolute left-4" /> : <Icons.github className="w-4 h-4 absolute left-4" />}
                                Continue with GitHub
                            </Button>
                        </div>
                        <div className="w-full">
                            <Button
                                size="lg"
                                type="button"
                                disabled={isGoogleLoading || isGithubLoading || isLinkedinLoading || isEmailLoading}
                                onClick={() => handleOAuth("oauth_linkedin")}
                                variant="tertiary"
                                className="w-full"
                            >
                                {isLinkedinLoading ?
                                    <LoadingIcon size="sm" className="w-4 h-4 absolute left-4" /> :
                                    <Icons.linkedin className="w-4 h-4 absolute left-4" />}
                                Continue with LinkedIn
                            </Button>
                        </div>
                        <div className="w-full">
                            <Button
                                size="lg"
                                type="button"
                                variant="tertiary"
                                disabled={isGoogleLoading || isGithubLoading || isLinkedinLoading}
                                onClick={() => setIsEmailOpen(false)}
                                className="w-full"
                            >
                                <MailIcon className="w-4 h-4 absolute left-4" />
                                Continue with email
                            </Button>
                        </div>
                        <div className="pt-8 text-muted-foreground text-sm">
                            <span>Already have an account?</span> <Link href="/auth/signin" className="text-foreground">Sign In</Link>
                        </div>
                    </motion.div>
                </div>
            ) : (
                <div>
                    {isCodeSent ? (
                        <div>
                            <motion.form
                                variants={FADE_IN_VARIANTS}
                                animate="visible"
                                initial="hidden"
                                onSubmit={handleVerifyCode}
                                className="py-8 w-full flex flex-col gap-4"
                            >
                                <div className="felx justify-center w-full pl-0.5">
                                    <Label htmlFor="name">
                                        Verification Code
                                    </Label>
                                    <div className="flex justify-center w-full my-2">
                                        <InputOTP
                                            id="code"
                                            name="code"
                                            maxLength={6}
                                            value={code}
                                            disabled={!isLoaded || isCodeLoading}
                                            onChange={(e) => setCode(e)}
                                            className="felx justify-center w-full"
                                        >
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <Button
                                        type="submit"
                                        disabled={isCodeLoading}
                                        className="w-full"
                                    >
                                        {isCodeLoading ? <LoadingIcon size="sm" className="mr-2" /> : "Verify code"}
                                    </Button>
                                </div>
                                <div className="w-full flex items-center gap-2">
                                    <Button
                                        asChild
                                        type="button"
                                        disabled={isCodeLoading}
                                        variant="tertiary"
                                        className="w-full"
                                    >
                                        <Link href="https://mail.google.com" target="_blank">
                                            Open gmail
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        type="button"
                                        disabled={isCodeLoading}
                                        variant="tertiary"
                                        className="w-full"
                                    >
                                        <Link href="https://outlook.live.com" target="_blank">
                                            Open outlook
                                        </Link>
                                    </Button>
                                </div>
                            </motion.form>
                        </div>
                    ) : (
                        <div>
                            <motion.form
                                variants={FADE_IN_VARIANTS}
                                animate="visible"
                                initial="hidden"
                                onSubmit={handleEmail}
                                className="py-8 w-full flex flex-col gap-4"
                            >
                                <div className="w-full">
                                    <Label htmlFor="name" className="flex justify-start pb-2">
                                        Username
                                    </Label>
                                    <Input
                                        autoFocus
                                        name="username"
                                        type="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter your username"
                                        className="w-full"
                                    />
                                </div>
                                <div className="w-full">
                                    <Label htmlFor="name" className="flex justify-start pb-2">
                                        Email
                                    </Label>
                                    <Input
                                        autoFocus
                                        name="email"
                                        type="email"
                                        value={email}
                                        disabled={isEmailLoading}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="w-full"
                                    />
                                </div>
                                <div className="w-full">
                                    <Button
                                        type="submit"
                                        disabled={isEmailLoading}
                                        className="w-full"
                                    >
                                        {isEmailLoading ? <LoadingIcon size="sm" className="mr-2" /> : "Continue"}
                                    </Button>
                                </div>
                                <div className="w-full">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        disabled={isEmailLoading}
                                        onClick={() => setIsEmailOpen(true)}
                                        className="w-full"
                                    >
                                        <ArrowLeftIcon className="w-3.5 h-3.5 mr-2" />
                                        Back
                                    </Button>
                                </div>
                            </motion.form>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
};

export default SignUpForm;