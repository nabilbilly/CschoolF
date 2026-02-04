import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import schoolImg19 from '../../assets/schoolimg19.webp';
import schoolImg20 from '../../assets/schoolimg20.png';
import schoolImg21 from '../../assets/schoolimg21.webp';
const details = [
    {
        title: "Smart Learning Management System",
        desc: "Empower your teachers and students with a robust LMS.",
        points: [
            "Upload course materials and assignments",
            "Online quizzes and automated grading",
            "Class scheduling and timetables",
            "Student discussion forums"
        ],
        image: schoolImg21
    },
    {
        title: "Seamless Financial Operations",
        desc: "Take control of your school's finances with transparency and ease.",
        points: [
            "Automated fee invoicing and reminders",
            "Integration with Mobile Money & Cards",
            "Expense tracking and categorization",
            "Real-time financial dashboard"
        ],
        image: schoolImg20
    },
    {
        title: "Parent & Guardian Engagement",
        desc: "Build strong relationships with parents through constant communication.",
        points: [
            "Real-time SMS and email alerts",
            "Parent portal for grade & attendance viewing",
            "Event calendars and newsletters",
            "Direct messaging with teachers"
        ],
        image: schoolImg19
    }
];

export const FeatureDetails = () => {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6 space-y-32">
                {details.map((item, index) => (
                    <div key={index} className={`flex flex-col lg:flex-row gap-16 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                        <motion.div
                            className="w-full lg:w-1/2 space-y-6"
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                                {item.title}
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {item.desc}
                            </p>
                            <ul className="space-y-4">
                                {item.points.map((point, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-slate-700">
                                        <CheckCircle2 className="text-secondary-500 h-5 w-5 flex-shrink-0" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-4">
                                <Button variant="outline">Learn More</Button>
                            </div>
                        </motion.div>

                        <motion.div
                            className="w-full lg:w-1/2"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    );
};
