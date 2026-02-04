import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import schoolImg3 from '../../assets/schoolimage3.jpg';

const benefits = [
    "Comprehensive Student Profiles",
    "Homework & Assignments uploads",
    "Integrated Gradebook & Reports",
    "Seamless Fee Management",
];

export const AboutSection = () => {
    return (
        <section id="about" className="py-20 md:py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src={schoolImg3}
                                alt="Students using tablets"
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-primary-600/10 mix-blend-multiply" />
                        </div>
                        {/* Floating Card */}
                        <div className="hidden md:block absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-xl max-w-xs border border-slate-100">
                            <h4 className="font-bold text-4xl text-primary-600 mb-2">15+</h4>
                            <p className="text-slate-600 font-medium">Years of excellence in education technology.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 font-medium text-sm">
                            About cschool
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
                            Reimagining School Management for the Modern Era
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            We believe that technology should enable educators, not burden them.
                            Our platform is designed from the ground up to be intuitive, powerful,
                            and adaptable to the unique needs of Ghanaian schools.
                        </p>

                        <ul className="space-y-3">
                            {benefits.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-slate-700">
                                    <CheckCircle className="text-secondary-500 h-5 w-5 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="pt-4">
                            <Link to="/about">
                                <Button variant="outline" size="lg" className="gap-2">
                                    Discover Our Mission
                                    <ArrowRight size={18} />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
