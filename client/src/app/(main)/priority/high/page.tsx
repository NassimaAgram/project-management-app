"use client";

import dynamic from "next/dynamic";
import { Priority } from "@/state/api";

const ReusablePriorityPage = dynamic(() => import("../reusablePriorityPage"), {
  ssr: false, // Avoid Clerk issues during SSR
});

const Urgent = () => {
  return <ReusablePriorityPage priority={Priority.High} />;
};

export default Urgent;
