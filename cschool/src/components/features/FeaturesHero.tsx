import { motion } from 'framer-motion';
import schoolImg18 from '../../assets/schoolimg18.jpg';

export const FeaturesHero = () => {
    return (
        <section className="bg-slate-900 py-20 md:py-32 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary-900 to-slate-900 opacity-50" />
            <div
                className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-20"
                style={{ backgroundImage: `url(${schoolImg18})` }}
            />

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 font-medium text-sm mb-6">
                        Powering Modern Education
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Everything You Need to Run a <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
                            World-Class School
                        </span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        From admissions to alumni management, cschool integrates every aspect of school administration into one intuitive platform.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
