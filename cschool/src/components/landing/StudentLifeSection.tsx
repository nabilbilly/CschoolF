import { motion } from 'framer-motion';
import { Trophy, Mic, Bot, Music, Globe, Palette } from 'lucide-react';
import schoolImg4 from '../../assets/schoolimg4.png';
import schoolImg5 from '../../assets/schoolimg5.jpg';
import schoolImg6 from '../../assets/schoolimg7.png';
import schoolImg8 from '../../assets/schoolimg8.jpg';
import schoolImg9 from '../../assets/schoolimg9.jpg';
import schoolImg10 from '../../assets/schoolimg10.jpg';

const activities = [
    {
        title: "Sports",
        icon: Trophy,
        image: schoolImg4,
        color: "bg-orange-500"
    },
    {
        title: "Debate & Public Speaking",
        icon: Mic,
        image: schoolImg5,
        color: "bg-purple-500"
    },
    {
        title: "Robotics / ICT Club",
        icon: Bot,
        image: schoolImg6,
        color: "bg-blue-500"
    },
    {
        title: "Cultural Performances",
        icon: Globe,
        image: schoolImg8,
        color: "bg-red-500"
    },
    {
        title: "Music & Drama",
        icon: Music,
        image: schoolImg9,
        color: "bg-pink-500"
    },
    {
        title: "Excursions & Workshops",
        icon: Palette,
        image: schoolImg10,
        color: "bg-green-500"
    }
];

export const StudentLifeSection = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-bold text-primary-600 tracking-widest uppercase mb-3">Student Life</h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                        More Than Just a School
                    </h3>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Students enjoy a balanced school life filled with activities that build confidence, teamwork, and leadership.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activities.map((activity, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-lg"
                        >
                            {/* Background with overlay */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${activity.image})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <div className={`inline-flex p-2 rounded-lg ${activity.color} text-white mb-3 shadow-md`}>
                                    <activity.icon size={20} />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">{activity.title}</h4>
                                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                    Explore our vibrant {activity.title.toLowerCase()} program designed to nurture talent.
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
