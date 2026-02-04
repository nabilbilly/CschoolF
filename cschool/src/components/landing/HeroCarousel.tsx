import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ArrowRight, School, LogIn, CheckCircle2 } from 'lucide-react';
import schoolImg2 from '../../assets/schoolimg2.jpg';
import schoolImg1 from '../../assets/schoolimg1.jpg';

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop",
        title: "Empowering the Next Generation",
        subtitle: "Modern education management for forward-thinking institutions.",
    },
    {
        id: 2,
        image: schoolImg2,
        title: "Streamlined Administration",
        subtitle: "Effortless management of admissions, fees, and grading.",
    },
    {
        id: 3,
        image: schoolImg1,
        title: "Connected Learning Communities",
        subtitle: "Bridging the gap between teachers, students, and parents.",
    },
];

export const HeroCarousel = () => {
    const [current, setCurrent] = useState(0);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden bg-slate-900">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slides[current].image})` }}
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </motion.div>
            </AnimatePresence>

            <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
                <div className="max-w-4xl">
                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={`h1-${current}`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight"
                        >
                            {slides[current].title}
                        </motion.h1>

                        <motion.p
                            key={`p-${current}`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-xl md:text-2xl text-slate-200 mb-8 max-w-2xl mx-auto"
                        >
                            {slides[current].subtitle}
                        </motion.p>

                        <motion.div
                            key={`btn-${current}`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Button
                                size="lg"
                                variant="default"
                                className="text-lg px-8 w-full sm:w-auto"
                                onClick={() => setShowWelcomeModal(true)}
                            >
                                Get Started
                            </Button>
                            <Link to="/about">
                                <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-slate-900 w-full sm:w-auto">
                                    Learn More <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === current ? "bg-white w-8" : "bg-white/50 hover:bg-white/70"
                            }`}
                    />
                ))}
            </div>
            {/* Welcome Modal */}
            <Modal
                isOpen={showWelcomeModal}
                onClose={() => setShowWelcomeModal(false)}
                title="Welcome to cschool"
            >
                <div className="text-center py-4">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <School className="w-8 h-8 text-primary-600" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">Welcome Guest!</h4>
                    <p className="text-slate-600 mb-6">
                        How would you like to proceed today?
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                        <Link to="/student/login" className="w-full">
                            <Button
                                className="w-full justify-between group border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 hover:border-blue-300"
                                variant="outline"
                                size="lg"
                            >
                                <span className="flex items-center gap-2">
                                    <LogIn size={18} className="text-blue-500 group-hover:text-blue-700" />
                                    Portal Login
                                </span>
                                <ArrowRight size={16} className="text-blue-300 group-hover:text-blue-700" />
                            </Button>
                        </Link>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-400">Or</span>
                            </div>
                        </div>

                        <Link to="/admission/verification" className="w-full">
                            <Button className="w-full justify-between group" variant="default" size="lg">
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 size={18} />
                                    Admission Verification
                                </span>
                                <ArrowRight size={16} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </Modal>
        </section>
    );
};
