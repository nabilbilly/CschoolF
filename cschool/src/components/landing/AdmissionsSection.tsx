import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import admissionImg from '../../assets/schoolimg1.jpg';

const steps = [
    "Fill the admission form",
    "Submit required documents",
    "Entrance assessment (if required)",
    "Parent interview",
    "Enrollment confirmation"
];

export const AdmissionsSection = () => {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    <motion.div
                        className="w-full lg:w-1/2 space-y-8"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div>
                            <div className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 font-medium text-sm mb-4">
                                Admissions Open
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                                Join the <span className="text-primary-600">First Schools</span> Family
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                We welcome applications from KG, Primary, JHS, and SHS. Our admissions team ensures a simple and friendly process from inquiry to enrollment.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-slate-900">How to Apply</h3>
                            <div className="space-y-4">
                                {steps.map((step, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <span className="text-slate-700 font-medium">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4">
                            <Link to="/admission/verification">
                                <Button size="lg" className="w-full sm:w-auto">
                                    Start Your Application
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>

                        <div className="flex gap-8 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                                <CheckCircle2 className="text-green-500 h-5 w-5" />
                                <span>Experienced Teachers</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                                <CheckCircle2 className="text-green-500 h-5 w-5" />
                                <span>Safe Environment</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="w-full lg:w-1/2"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <img
                                src="https://images.unsplash.com/photo-1577896334614-201b37d8c421?q=80&w=2070&auto=format&fit=crop"
                                alt="Students studying"
                                className="rounded-2xl w-full h-64 object-cover mb-8 shadow-lg translate-y-8"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1974&auto=format&fit=crop"
                                alt="Teacher helping student"
                                className="rounded-2xl w-full h-64 object-cover shadow-lg"
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};
