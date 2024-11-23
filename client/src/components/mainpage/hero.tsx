"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { BlurText } from "../ui/blur-text";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Container from "../global/container";
import { BorderBeam } from "../ui/border-beam";

const Hero = () => {
    return (
        <div className="flex flex-col items-center text-center w-full max-w-5xl my-24 mx-auto z-40 relative">
            <Container delay={0.0}>
                <div className="pl-2 pr-1 py-1 rounded-full border border-foreground/10 hover:border-foreground/15 backdrop-blur-lg cursor-pointer flex items-center gap-2.5 select-none w-max mx-auto">
                    <div className="w-3.5 h-3.5 rounded-full bg-primary/40 flex items-center justify-center relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary/60 flex items-center justify-center animate-ping">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary/60 flex items-center justify-center animate-ping"></div>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        </div>
                    </div>
                    <span className="inline-flex items-center justify-center gap-2 animate-text-gradient animate-background-shine bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text text-sm text-transparent">
                        Plan for success
                        <span className="text-xs text-secondary-foreground px-1.5 py-0.5 rounded-full bg-gradient-to-b from-foreground/20 to-foreground/10 flex items-center justify-center">
                            What&apos;s new
                            <ArrowRightIcon className="w-3.5 h-3.5 ml-1 text-foreground/50" />
                        </span>
                    </span>
                </div>
            </Container>
            <BlurText
                word={"Your ultimate project\n management solution"}
                className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent py-2 md:py-0 lg:!leading-snug font-medium tracking-[-0.0125em] mt-6 font-heading"
            />
            <Container delay={0.1}>
                <p className="text-sm sm:text-base lg:text-lg mt-4 text-accent-foreground/60 max-w-2xl mx-auto">
                    Achieve project goals efficiently with real-time collaboration, task management, and insightful analytics. <span className="hidden sm:inline">ProjeXpert is the all-in-one platform for all your project management needs.</span>
                </p>
            </Container>
            <Container delay={0.2}>
                <div className="flex items-center justify-center md:gap-x-6 mt-8">
                    <Button asChild size="lg">
                        <Link href="/auth/sign-up">
                            Start for free
                        </Link>
                    </Button>
                </div>
            </Container>
            <Container delay={0.3} className="relative pt-10">
                <div className="relative mx-auto max-w-7xl rounded-xl border border-neutral-200/50 p-2  border-neutral-700 bg-neutral-800/50 md:p-4 mt-8">
                    <div className="absolute md:top-[10%] left-1/2 gradient w-3/4 -translate-x-1/2 h-1/4 md:h-1/3 inset-0 blur-[6rem] animate-image-glow"></div>
                    <div className="-m-2 rounded-xl p-2 ring-1 ring-inset ring-foreground/20 lg:-m-4 lg:rounded-2xl bg-opacity-50 backdrop-blur-3xl">
                    <BorderBeam size={250} duration={12} delay={9} />
                        <Image
                            src="/images/dashboard.png"
                            alt="Project management dashboard"
                            width={1920}
                            height={1080}
                            className="rounded-md lg:rounded-xl bg-foreground/10 ring-1 ring-border"
                        />
                        <div className="absolute -bottom-4 inset-x-0 w-full h-1/2 bg-gradient-to-t from-background z-40"></div>
                        <div className="absolute bottom-0 md:-bottom-8 inset-x-0 w-full h-1/4 bg-gradient-to-t from-background z-50"></div>
                    </div>
                </div>
            </Container >
        </div >
    )
};

export default Hero;
