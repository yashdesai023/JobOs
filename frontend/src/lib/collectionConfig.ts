export type FieldType = 'text' | 'email' | 'url' | 'select' | 'date' | 'file' | 'editor' | 'json';

export interface FieldConfig {
    name: string;
    label: string;
    type: FieldType;
    options?: string[]; // For select inputs
    required?: boolean;
    placeholder?: string;
    accept?: string; // For file inputs
}

export interface CollectionConfig {
    id: string;
    name: string;
    description: string;
    fields: FieldConfig[];
}

export const collections: Record<string, CollectionConfig> = {
    projects: {
        id: 'projects',
        name: 'Projects',
        description: 'Manage your portfolio projects.',
        fields: [
            { name: 'project_name', label: 'Project Name', type: 'text', required: true, placeholder: 'e.g. EcoMind AI' },
            { name: 'description', label: 'Description', type: 'editor', required: true, placeholder: 'Project details...' },
            { name: 'category', label: 'Category', type: 'select', options: ['Gen AI', 'DevOps', 'Backend', 'Testing', 'Frontend'], required: true },
            { name: 'thumbnail', label: 'Thumbnail Image', type: 'file', accept: 'image/*', required: true },
            { name: 'live_link', label: 'Live URL', type: 'url', placeholder: 'https://...' },
            { name: 'github_link', label: 'GitHub URL', type: 'url', placeholder: 'https://github.com/...' },
            { name: 'tech_stack', label: 'Tech Stack', type: 'text', placeholder: 'e.g. React, Python' },
        ]
    },
    resumes: {
        id: 'resumes',
        name: 'Resumes',
        description: 'Store versions of your general resume.',
        fields: [
            { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'e.g. Senior Backend Resume' },
            { name: 'category', label: 'Category', type: 'select', options: ['Gen AI', 'DevOps', 'Backend', 'Testing'], required: true },
            { name: 'version_date', label: 'Version Date', type: 'date', required: true },
            { name: 'file', label: 'Resume File', type: 'file', accept: '.pdf,.docx', required: true },
        ]
    },
    cvs: {
        id: 'cvs',
        name: 'Personalized CVs',
        description: 'CVs tailored for specific companies.',
        fields: [
            { name: 'company_name', label: 'Company Name', type: 'text', required: true, placeholder: 'e.g. Google' },
            { name: 'role_applied_for', label: 'Role', type: 'text', required: true, placeholder: 'e.g. AI Researcher' },
            { name: 'file', label: 'CV File', type: 'file', accept: '.pdf,.docx', required: true },
        ]
    },
    placement_agencies: {
        id: 'placement_agencies',
        name: 'Placement Agencies',
        description: 'Contacts for job hunting agencies.',
        fields: [
            { name: 'agency_name', label: 'Agency Name', type: 'text', required: true },
            { name: 'contact_person', label: 'Contact Person', type: 'text', placeholder: 'Name' },
            { name: 'phone', label: 'Phone', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'website', label: 'Website', type: 'url' },
            { name: 'notes', label: 'Notes', type: 'text' },
        ]
    },
    recruiters: {
        id: 'recruiters',
        name: 'Recruiters',
        description: 'Direct recruiter contacts.',
        fields: [
            { name: 'recruiter_name', label: 'Recruiter Name', type: 'text', required: true },
            { name: 'company', label: 'Company', type: 'text', required: true },
            { name: 'linkedin_profile', label: 'LinkedIn', type: 'url' },
            { name: 'phone', label: 'Phone', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'status', label: 'Status', type: 'select', options: ['New', 'Connected', 'Messaged', 'Interviewing'], required: true },
        ]
    },
    certifications: {
        id: 'certifications',
        name: 'Certifications',
        description: 'Your earned credentials.',
        fields: [
            { name: 'certificate_name', label: 'Certificate Name', type: 'text', required: true },
            { name: 'provider', label: 'Provider', type: 'text', placeholder: 'e.g. AWS' },
            { name: 'domain', label: 'Domain', type: 'select', options: ['Cloud', 'AI', 'Security', 'Development'], required: true },
            { name: 'completion_date', label: 'Completion Date', type: 'date' },
            { name: 'credential_url', label: 'Credential URL', type: 'url' },
            { name: 'certificate_file', label: 'Certificate File', type: 'file', accept: '.pdf,.png,.jpg', required: true },
        ]
    },
    skills: {
        id: 'skills',
        name: 'Skill Nexus',
        description: 'Strategic learning roadmap.',
        fields: [
            { name: 'title', label: 'Skill / Milestone', type: 'text', required: true, placeholder: 'e.g. Advanced TypeScript' },
            { name: 'status', label: 'Status', type: 'select', options: ['Backlog', 'In Progress', 'Completed'], required: true },
            { name: 'target_date', label: 'Target / Completion Date', type: 'date', required: true },
            { name: 'category', label: 'Category', type: 'select', options: ['Frontend', 'Backend', 'AI', 'DevOps', 'Design', 'Other'], required: true },
            { name: 'description', label: 'Deep Dive Notes', type: 'editor', required: false, placeholder: 'What did you learn? Resources?' },
            { name: 'icon', label: 'Icon (Emoji)', type: 'text', placeholder: 'e.g. 🚀' },
            { name: 'resource_links', label: 'Resource Links (JSON)', type: 'json' },
            { name: 'attachments', label: 'File Attachments', type: 'file', accept: '.pdf,.png,.jpg,.docx', required: false }
        ]
    }
};
