"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, useSignIn, useUser } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/types";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeftIcon, Eye, EyeOff, LoaderIcon, MailIcon } from "lucide-react";
import Icons from "../global/icons";
import LoadingIcon from "../ui/loading-icon";
import { FADE_IN_VARIANTS } from "@/constants";
import { z } from "zod";
import Link from "next/link";
import { SignInSchema, SignInSchemaType } from "@/schema";
import { Label } from "../ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";


const SignInForm = () => {

    const { user } = useUser();

    const [formData, setFormData] = useState<SignInSchemaType>({
        email: "",
        password: "",
    });

    const { isLoaded, signIn, setActive } = useSignIn();

    const [email, setEmail] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [isEmailOpen, setIsEmailOpen] = useState<boolean>(true);
    const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
    const [isEmailLoading, setIsEmailLoading] = useState<boolean>(false);
    const [isCodeLoading, setIsCodeLoading] = useState<boolean>(false);
    const [isAppleLoading, setIsAppleLoading] = useState<boolean>(false);

    const router = useRouter();
    const params = useSearchParams();
    const from = params.get("from");
    const { signOut } = useAuth();

    const [isLoading, setIsLoading] = useState(false);

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

        try {

            await signOut(); // Sign out the existing session

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

        setIsEmailLoading(true);

        try {

            await signIn.create({
                identifier: email,
            });

            await signIn.prepareFirstFactor({
                strategy: "email_code",
                emailAddressId: signIn.supportedFirstFactors!.find(
                    (factor) => factor.strategy === "email_code"
                )!.emailAddressId,
            });

            setIsCodeSent(true);

            toast.success("We have sent a code to your email address");

        } catch (error: any) {
            console.error(JSON.stringify(error, null, 2));
            switch (error.errors[0]?.code) {
                case "form_identifier_not_found":
                    toast.error("This email is not registered. Please sign up first.");
                    router.push("/auth/signup?from=signin");
                    break;
                case "too_many_attempts":
                    toast.error("Too many attempts. Please try again later.");
                    break;
                default:
                    toast.error("An error occurred. Please try again");
                    break;
            }
        } finally {
            setIsEmailLoading(false);
        }
    }

    const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isLoaded) return;

        if (!code) {
            toast.error("Please enter the code");
            return;
        }

        setIsCodeLoading(true);

        try {

            const signInAttempt = await signIn.attemptFirstFactor({
                strategy: "email_code",
                code,
            });

            if (signInAttempt.status === "complete") {
                toast.success("successful authentification");
                await setActive({ session: signInAttempt.createdSessionId });
                router.push("/auth/callback");
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2));
                toast.error("Invalid code. Please try again.");
            }

        } catch (error: any) {
            console.error(JSON.stringify(error, null, 2));
            switch (error.errors[0]?.code) {
                case "form_code_incorrect":
                    toast.error("Incorrect code. Please enter valid code.");
                    break;
                case "verification_failed":
                    toast.error("Verification failed. Please try after some time.");
                    break;
                case "too_many_attempts":
                    toast.error("Too many attempts. Please try again later.");
                    break;
                default:
                    toast.error("An error occurred. Please try again");
                    break;
            }
        } finally {
            setIsCodeLoading(false);
        }
    };

    useEffect(() => {
        if (from) {
            setIsEmailOpen(false);
        }
    }, []);

    return (
        <div className="flex flex-col text-center text-white w-full sm:w-[60%]">
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
                <p className="text-sm text-muted-foreground mt-2">
                    {isEmailOpen
                        ? "Choose a method to login"
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
                                disabled={isGoogleLoading || isAppleLoading || isEmailLoading}
                                onClick={() => handleOAuth("oauth_google")}
                                variant="tertiary"
                                className="w-full"
                            >
                                {isGoogleLoading ? (
                                    <LoadingIcon size="sm" className="w-4 h-4 absolute left-4" />
                                ) : (
                                    <Icons.google className="w-4 h-4 absolute left-4" />
                                )}
                                Continue with Google
                            </Button>
                        </div>
                        <div className="w-full">
                            <Button
                                size="lg"
                                type="button"
                                disabled={isGoogleLoading || isAppleLoading || isEmailLoading}
                                onClick={() => handleOAuth("oauth_apple")}
                                variant="tertiary"
                                className="w-full"
                            >
                                {isAppleLoading ? <LoadingIcon size="sm" className="w-4 h-4 absolute left-4" /> : <Icons.github className="w-4 h-4 absolute left-4" />}
                                Continue with GitHub
                            </Button>
                        </div>
                        <div className="w-full">
                            <Button
                                size="lg"
                                type="button"
                                disabled={isGoogleLoading || isAppleLoading || isEmailLoading}
                                onClick={() => handleOAuth("oauth_apple")}
                                variant="tertiary"
                                className="w-full"
                            >
                                {isAppleLoading ? <LoadingIcon size="sm" className="w-4 h-4 absolute left-4" /> : <Icons.linkedin className="w-4 h-4 absolute left-4" />}
                                Continue with LinkedIn
                            </Button>
                        </div>
                        <div className="w-full">
                            <Button
                                size="lg"
                                type="button"
                                variant="tertiary"
                                disabled={isGoogleLoading || isAppleLoading || isEmailLoading}
                                onClick={() => setIsEmailOpen(false)}
                                className="w-full"
                            >
                                <MailIcon className="w-4 h-4 absolute left-4" />
                                Continue with email
                            </Button>
                            <div className="pt-8 text-muted-foreground text-sm">
                                <span>Don't have an account?</span> <Link href="/auth/signup" className="text-foreground">Sign Up</Link>
                            </div>
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
                                    <Input
                                        autoFocus={true}
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

export default SignInForm;
