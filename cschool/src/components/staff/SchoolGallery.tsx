import { motion } from 'framer-motion';
import schoolImg22 from '../../assets/schoolimg22.jpg';

const photos = [
    { src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop", span: "col-span-1 md:col-span-2 row-span-2", alt: "Main Building" },
    { src: "https://images.unsplash.com/photo-1568792923760-d70635a89fdc?q=80&w=2070&auto=format&fit=crop", span: "col-span-1", alt: "Library" },
    { src: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=2072&auto=format&fit=crop", span: "col-span-1", alt: "Science Lab" },
    { src: schoolImg22, span: "col-span-1 md:col-span-2", alt: "Sports Field" },
    { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop", span: "col-span-1", alt: "Art Room" },
];

export const SchoolGallery = () => {
    return (
        <section className="py-20 bg-slate-900 text-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Campus</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        State-of-the-art facilities designed to provide a stimulating environment for academic and extracurricular growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
                    {photos.map((photo, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className={`relative rounded-xl overflow-hidden group ${photo.span}`}
                        >
                            <img
                                src={photo.src}
                                alt={photo.alt}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white font-bold text-lg tracking-wider">{photo.alt}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
