import { motion } from 'framer-motion';
import {
    BookOpen, Users, DollarSign, Calendar,
    ClipboardCheck, BarChart3, Shield, Smartphone
} from 'lucide-react';

const features = [
    {
        icon: BookOpen,
        title: "Learning Management",
        desc: "Share assignment, resources, and grades seamlessly with students."
    },
    {
        icon: Users,
        title: "Student Information",
        desc: "Centralized database for student profiles, history, and medical records."
    },
    {
        icon: DollarSign,
        title: "Fee Management",
        desc: "Automated billing, online payments, and comprehensive financial reporting."
    },
    {
        icon: Calendar,
        title: "Attendance Tracking",
        desc: "Digital attendance marking with instant SMS notifications to parents."
    },
    {
        icon: ClipboardCheck,
        title: "Admissions Portal",
        desc: "Paperless application process with status tracking for applicants."
    },
    {
        icon: BarChart3,
        title: "Advanced Analytics",
        desc: "Data-driven insights into academic performance and school operations."
    },
    {
        icon: Shield,
        title: "Role-Based Security",
        desc: "Granular access controls for admins, teachers, parents, and students."
    },
    {
        icon: Smartphone,
        title: "Mobile App",
        desc: "Native mobile experience for accessing the platform on the go."
    }
];

export const FeatureGrid = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:border-primary-100 transition-all group"
                        >
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
