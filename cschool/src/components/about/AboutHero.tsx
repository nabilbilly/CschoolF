import { motion } from 'framer-motion';
import schoolImg11 from '../../assets/schoolimg11.jpg';

export const AboutHero = () => {
    return (
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src={schoolImg11}
                    alt="School Building"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/60" />
            </div>

            <div className="relative z-10 container mx-auto px-4 text-center text-white">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
                >
                    Our Story
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto leading-relaxed"
                >
                    Celebrating excellence, nurturing potential, and building the future leaders of Ghana since 2005.
                </motion.p>
            </div>
        </section>
    );
};
