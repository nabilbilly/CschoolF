import { motion } from 'framer-motion';
import { Trophy, Award, Star } from 'lucide-react';

export const AchievementsSection = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">

                {/* BECE Performance - Simple Visual Representation */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Academic Excellence</h2>
                        <p className="text-lg text-slate-600">Consistently ranking among the top schools in the annual BECE.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { year: "2023", rate: "100%", label: "Distinction Rate" },
                            { year: "2022", rate: "98.5%", label: "Distinction Rate" },
                            { year: "2021", rate: "99.2%", label: "Distinction Rate" },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-primary-50 p-8 rounded-2xl text-center">
                                <div className="text-slate-500 font-medium mb-2">BECE {stat.year}</div>
                                <div className="text-5xl font-bold text-primary-600 mb-2">{stat.rate}</div>
                                <div className="text-slate-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Awards Grid */}
                <div>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Awards & Recognition</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Trophy, title: "Best Science School 2023", org: "Regional Education Office" },
                            { icon: Star, title: "Excellence in Sports", org: "Inter-School Games" },
                            { icon: Award, title: "Cleanest Campus Award", org: "EPA" },
                            { icon: Star, title: "Top ICT Club", org: "National Coding Challenge" },
                        ].map((award, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all text-center"
                            >
                                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <award.icon size={24} />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{award.title}</h3>
                                <p className="text-sm text-slate-500">{award.org}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};
