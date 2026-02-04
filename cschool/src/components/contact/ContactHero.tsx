import { motion } from 'framer-motion';

export const ContactHero = () => {
    return (
        <section className="bg-primary-900 py-20 relative overflow-hidden text-center text-white">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-6xl font-bold mb-4"
                >
                    Get in Touch
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto"
                >
                    We act as a collaborative partner in your child's education. Have questions? We're here to help.
                </motion.p>
            </div>
        </section>
    );
};
