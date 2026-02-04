import { motion } from 'framer-motion';
import { Monitor, Book, FlaskConical, Wifi, Coffee, ShieldCheck } from 'lucide-react';

const facilities = [
    { icon: Monitor, label: "Modern Classrooms" },
    { icon: Wifi, label: "ICT Lab / Computer Room" },
    { icon: Book, label: "Library & Reading Center" },
    { icon: FlaskConical, label: "Science Laboratory (JHS/SHS)" },
    { icon: Coffee, label: "Clean Sanitation Facilities" },
    { icon: ShieldCheck, label: "Sports Field & Equipment" },
];

export const FacilitiesSection = () => {
    return (
        <section className="py-20 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <motion.div
                        className="w-full md:w-1/2"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                            A School Equipped for <span className="text-primary-600">Excellence</span>
                        </h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            We provide a conducive learning environment with state-of-the-art infrastructure to support academic and extracurricular growth.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {facilities.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                    <div className="p-3 bg-secondary-50 text-secondary-600 rounded-lg">
                                        <item.icon size={24} />
                                    </div>
                                    <span className="font-semibold text-slate-800">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        className="w-full md:w-1/2"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086&auto=format&fit=crop"
                                alt="School Facilities"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-8 left-8 text-white">
                                <p className="font-bold text-2xl">World-Class Infrastructure</p>
                                <p className="text-slate-200">Designed for the future.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
