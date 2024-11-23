type PLAN = {
    id: string;
    title: string;
    desc: string;
    monthlyPrice: number;
    yearlyPrice: number;
    badge?: string;
    buttonText: string;
    features: string[];
    link: string;
};

export const PLANS: PLAN[] = [
    {
        id: "free",
        title: "Free",
        desc: "Essential tools for individual task management and project tracking.",
        monthlyPrice: 0,
        yearlyPrice: 0,
        buttonText: "Get Started",
        features: [
            "Basic task management",
            "3 project limit",
            "Community support",
            "Basic analytics",
            "Unlimited team members",
            "File sharing up to 2GB"
        ],
        link: "https://example.com/basic-plan-link"
    },
    {
        id: "pro",
        title: "Pro",
        desc: "Enhanced features for growing teams and complex projects.",
        monthlyPrice: 10,
        yearlyPrice: 100,
        badge: "Most Popular",
        buttonText: "Upgrade to Pro",
        features: [
            "Advanced task management and dependencies",
            "Unlimited projects",
            "Priority email support",
            "Detailed analytics & reporting",
            "Timeline and Gantt charts",
            "Team collaboration tools",
            "Custom workflows",
            "File sharing up to 10GB"
        ],
        link: "https://example.com/pro-plan-link"
    },
    {
        id: "enterprise",
        title: "Enterprise",
        desc: "Tailored solutions for large organizations and agencies.",
        monthlyPrice: 15,
        yearlyPrice: 150,
        badge: "Contact Sales",
        buttonText: "Upgrade to Enterprise",
        features: [
            "Unlimited projects and task automation",
            "All integrations with third-party tools",
            "Dedicated account manager",
            "Advanced analytics & custom reporting",
            "Enterprise-grade security & compliance",
            "Unlimited file storage",
            "Custom onboarding and training"
        ],
        link: "https://example.com/enterprise-plan-link"
    }
];
