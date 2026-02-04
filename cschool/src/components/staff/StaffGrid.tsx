import { motion } from 'framer-motion';
import { Mail, Linkedin } from 'lucide-react';

interface StaffMember {
    name: string;
    role: string;
    image: string;
    bio?: string;
}

interface StaffGridProps {
    title: string;
    description?: string;
    staff: StaffMember[];
}

export const StaffGrid = ({ title, description, staff }: StaffGridProps) => {
    return (
        <section className="py-20 bg-white border-t border-slate-100">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{title}</h2>
                    {description && <p className="text-slate-600 text-lg">{description}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {staff.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group"
                        >
                            <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[3/4]">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                    <div className="flex gap-4 text-white">
                                        <button className="p-2 hover:bg-white/20 rounded-full transition-colors"><Mail size={20} /></button>
                                        <button className="p-2 hover:bg-white/20 rounded-full transition-colors"><Linkedin size={20} /></button>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                                <p className="text-primary-600 font-medium mb-2">{member.role}</p>
                                {member.bio && <p className="text-sm text-slate-500">{member.bio}</p>}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
