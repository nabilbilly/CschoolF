import { motion } from 'framer-motion';
import { FileText, Users, Phone } from 'lucide-react';

const offerings = [
    {
        icon: FileText,
        title: "Regular Academic Updates",
        desc: "Stay informed about your child's performance with timely reports."
    },
    {
        icon: FileText,
        title: "Behavioural Reports",
        desc: "Holistic tracking of student conduct and character development."
    },
    {
        icon: Users,
        title: "Termly Meetings",
        desc: "Dedicated time for in-depth discussions with teachers."
    },
    {
        icon: Phone,
        title: "Open Communication",
        desc: "Direct channels to administration and teaching staff."
    }
];

export const ParentsSection = () => {
    return (
        <section className="py-20 bg-primary-900 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-800/50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        We Value Strong <br /><span className="text-secondary-400">School–Parent Partnership</span>
                    </h2>
                    <p className="text-lg text-primary-100">
                        Education is a collaborative effort. We ensure parents are active participants in their child's learning journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {offerings.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors"
                        >
                            <div className="h-12 w-12 rounded-full bg-secondary-500/20 text-secondary-400 flex items-center justify-center mb-6">
                                <item.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
