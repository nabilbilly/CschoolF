import { ShieldCheck, UserCheck, HeartHandshake } from 'lucide-react';

export const WhyTrustUs = () => {
    return (
        <section className="py-20 bg-primary-900 text-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Parents Trust Us</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        {
                            icon: ShieldCheck,
                            title: "Safe Environment",
                            desc: "Top-notch security and a caring atmosphere ensure your child is always safe and happy."
                        },
                        {
                            icon: UserCheck,
                            title: "Expert Faculty",
                            desc: "Qualified, passionate teachers who are dedicated to unlocking every child's potential."
                        },
                        {
                            icon: HeartHandshake,
                            title: "Moral Upbringing",
                            desc: "We prioritize character building alongside academic excellence, rooting learning in strong values."
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="text-center">
                            <div className="w-20 h-20 bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-6 text-secondary-400">
                                <item.icon size={40} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                            <p className="text-primary-100 text-lg leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
