import { motion } from 'framer-motion';

const stats = [
    { label: "Schools Partnered", value: "50+" },
    { label: "Students Managed", value: "12,000+" },
    { label: "Teachers Empowered", value: "850+" },
    { label: "Uptime Guarantee", value: "99.9%" },
];

export const StatsSection = () => {
    return (
        <section className="py-20 bg-primary-900 text-white overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                                {stat.value}
                            </div>
                            <div className="text-blue-200 font-medium">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
