import { motion } from 'framer-motion';
import { Target, Eye, Heart } from 'lucide-react';

const values = [
    {
        icon: Target,
        title: "Our Mission",
        desc: "To provide a holistic education that empowers students with knowledge, character, and skills to thrive in a global world while upholding Ghanaian cultural values."
    },
    {
        icon: Eye,
        title: "Our Vision",
        desc: "To be the premier educational institution in Ghana, recognized for academic excellence, innovation, and morality."
    },
    {
        icon: Heart,
        title: "Core Values",
        desc: "Excellence, Integrity, Discipline, Respect, and Service to Community define every aspect of our school culture."
    }
];

export const MissionVisionValues = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {values.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center hover:shadow-lg transition-shadow"
                        >
                            <div className="w-16 h-16 bg-white rounded-full shadow-sm text-primary-600 flex items-center justify-center mx-auto mb-6">
                                <item.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
