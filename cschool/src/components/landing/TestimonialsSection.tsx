import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        content: "The level of care and attention my child receives at cschool is outstanding. Their holistic approach to education is exactly what we were looking for.",
        author: "Mrs. Sarah Osei",
        role: "Parent, Grade 4"
    },
    {
        content: "The facilities are world-class and the teachers are incredibly supportive. I've seen a massive improvement in my son's confidence since he joined.",
        author: "Mr. Kwame Mensah",
        role: "Parent, JHS 2"
    },
    {
        content: "cschool provides a perfect balance between academics and extracurricular activities. It's truly a place where children can thrive.",
        author: "Dr. Elizabeth Addo",
        role: "Parent, SHS 1"
    }
];

export const TestimonialsSection = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-16">
                    What Parents Say
                </h2>

                <div className="max-w-4xl mx-auto relative h-[300px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl border border-slate-100"
                        >
                            <Quote className="text-primary-200 mb-6 h-12 w-12" />
                            <p className="text-xl md:text-2xl text-slate-700 italic font-medium leading-relaxed mb-8">
                                "{testimonials[current].content}"
                            </p>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">{testimonials[current].author}</h4>
                                <p className="text-primary-600 font-medium">{testimonials[current].role}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-center gap-3 mt-8">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === current ? "bg-primary-600 w-8" : "bg-slate-300 hover:bg-primary-400"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
