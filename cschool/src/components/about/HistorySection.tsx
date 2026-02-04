import { motion } from 'framer-motion';

const milestones = [
    { year: "2005", title: "Inception", desc: "Founded with just 15 students and 3 teachers in a small rented bungalow." },
    { year: "2010", title: "First Expansion", desc: "Moved to our permanent campus with a new 12-classroom block." },
    { year: "2015", title: "JHS Excellence", desc: "Graduated our first BECE batch with 100% distinction." },
    { year: "2020", title: "Digital Transformation", desc: "Launched e-learning portals and smart classrooms." },
    { year: "2024", title: "SHS Wing", desc: "inaugurated the Senior High School department with modern science labs." },
];

export const HistorySection = () => {
    return (
        <section className="py-20 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">Our History & Milestones</h2>
                    <p className="text-lg text-slate-600">
                        From humble beginnings to a center of excellence, our journey has been one of resilience and growth.
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-slate-200 hidden md:block" />

                    <div className="space-y-12">
                        {milestones.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className="w-full md:w-1/2 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="text-3xl font-bold text-primary-600">{item.year}</span>
                                        <div className="h-0.5 flex-1 bg-slate-100" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-slate-600">{item.desc}</p>
                                </div>

                                <div className="relative z-10 w-4 h-4 rounded-full bg-secondary-500 ring-4 ring-white hidden md:block" />

                                <div className="w-full md:w-1/2 hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
