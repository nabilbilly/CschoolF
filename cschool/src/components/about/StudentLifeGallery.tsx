import schoolImg12 from '../../assets/schoolimg12.jpg';
import schoolImg13 from '../../assets/schoolimg13.webp';
import schoolImg14 from '../../assets/schoolimg14.webp';
import schoolImg15 from '../../assets/schoolimg15.webp';
import schoolImg16 from '../../assets/schoolimg23.webp';
import schoolImg17 from '../../assets/schoolimg17.webp';

export const StudentLifeGallery = () => {
    const images = [
        schoolImg17,
        schoolImg13,
        schoolImg14,
        schoolImg15,
        schoolImg16,
        schoolImg12,

    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Life at cschool</h2>
                    <p className="text-lg text-slate-600">A glimpse into our vibrant classrooms, sports fields, and laboratories.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((src, idx) => (
                        <div key={idx} className="relative group overflow-hidden rounded-xl aspect-[4/3]">
                            <img
                                src={src}
                                alt={`Student activity ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
