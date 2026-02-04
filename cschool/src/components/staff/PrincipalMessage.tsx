import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export const PrincipalMessage = () => {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <motion.div
                        className="w-full lg:w-1/3"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary-600 rounded-2xl transform rotate-3" />
                            <img
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"
                                alt="Mrs. Agnes Ofori"
                                className="relative rounded-2xl shadow-xl w-full h-[500px] object-cover"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className="w-full lg:w-2/3"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="mb-6">
                            <span className="text-primary-600 font-bold tracking-wider text-sm">FROM THE PRINCIPAL'S DESK</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2">Welcome to cschool</h2>
                        </div>

                        <div className="relative">
                            <Quote className="absolute -top-4 -left-4 text-primary-200 h-10 w-10 opacity-50" />
                            <blockquote className="text-lg md:text-xl text-slate-600 leading-relaxed italic pl-6 border-l-4 border-primary-500 mb-6">
                                "Our mission goes beyond academic excellence. We strive to mold character, instill discipline, and ignite a lifelong passion for learning in every child that walks through our gates. We believe that every student has a unique potential waiting to be unlocked."
                            </blockquote>
                        </div>

                        <div>
                            <h4 className="text-xl font-bold text-slate-900">Mrs. Agnes Ofori</h4>
                            <p className="text-slate-500">Principal, cschool</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
