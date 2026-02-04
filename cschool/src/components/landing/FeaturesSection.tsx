import { motion } from 'framer-motion';
import {
    Users, BookOpen, Calendar, CreditCard,
    Bus, GraduationCap, Utensils, LayoutDashboard
} from 'lucide-react';

const features = [
    {
        icon: Users,
        title: "Student Management",
        description: "Complete profiles, enrollment history, and document storage for every student."
    },
    {
        icon: GraduationCap,
        title: "Academics & Grading",
        description: "Flexible grading systems, report card generation, and transcript management."
    },
    {
        icon: Calendar,
        title: "Attendance Tracking",
        description: "Daily attendance for students and staff with automated SMS notifications to parents."
    },
    {
        icon: CreditCard,
        title: "Fee Collection",
        description: "Online payments, receipt generation, and automated reminders for outstanding fees."
    },
    {
        icon: Bus,
        title: "Transport Management",
        description: "Route planning, vehicle tracking, and transport fee management."
    },
    {
        icon: Utensils,
        title: "Canteen & Hostel",
        description: "Manage meal plans, hostel inventory, and room allocation efficiently."
    },
    {
        icon: BookOpen,
        title: "Library System",
        description: "Catalog books, track issued items, and manage fines for overdue returns."
    },
    {
        icon: LayoutDashboard,
        title: "Admin Dashboard",
        description: "Real-time insights into school performance, finances, and operational metrics."
    }
];

export const FeaturesSection = () => {
    return (
        <section id="features" className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                        Everything You Need to Run Your School
                    </h2>
                    <p className="text-lg text-slate-600">
                        A comprehensive suite of tools designed to streamline every aspect of educational administration.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100"
                        >
                            <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
