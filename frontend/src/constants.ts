export const ROLE_OPTIONS = [
    { value: "frontend", label: "Frontend Developer" },
    { value: "backend", label: "Backend Developer" },
    { value: "fullstack", label: "Full Stack Engineer" },
    { value: "ai_engineer", label: "AI Engineer" },
    { value: "data_scientist", label: "Data Scientist" },
    { value: "devops", label: "DevOps Engineer" },
    { value: "product_manager", label: "Product Manager" },
    { value: "ui_ux_designer", label: "UI/UX Designer" },
    { value: "qa_engineer", label: "QA Engineer" },
    { value: "mobile_engineer", label: "Mobile Developer" },
    { value: "cloud_architect", label: "Cloud Architect" },
    { value: "technical_writer", label: "Technical Writer" },
    { value: "business_analyst", label: "Business Analyst" },
    { value: "solutions_architect", label: "Solutions Architect" }
];

export const STATUS_OPTIONS = [
    { value: 'Not Applied', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
    { value: 'Applied', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { value: 'Screening', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
    { value: 'Interview', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { value: 'Offer', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
    { value: 'Rejected', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
    { value: 'Ghosted', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
];

export const STATUS_COLORS: any = STATUS_OPTIONS.reduce((acc: any, curr) => {
    acc[curr.value] = curr.color;
    return acc;
}, {});
