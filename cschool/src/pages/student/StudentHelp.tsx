import { useState } from 'react';
import {
    HelpCircle,
    MessageCircle,
    Phone,
    Mail,
    FileText,
    CreditCard,
    User,
    Calendar,
    Megaphone,
    ChevronDown,
    ChevronUp,
    Send,
    Lightbulb
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../lib/utils';

// Help Topics Data
const helpTopics = [
    {
        id: 'login',
        icon: User,
        title: 'Login Problems',
        content: 'If you cannot log in, check your Student ID and password. If you forgot your password, use the "Forgot Password" link on the login page or ask your class teacher to reset it for you.'
    },
    {
        id: 'results',
        icon: FileText,
        title: 'Viewing Results',
        content: 'To view your results, go to "Results & Performance" in the sidebar. You can see your exam scores and class scores there. If a result is missing, please tell your subject teacher.'
    },
    {
        id: 'timetable',
        icon: Calendar,
        title: 'Timetable Issues',
        content: 'Your timetable shows your daily classes. If you see a mistake or a missing class, please check the class noticeboard first, then talk to your class teacher.'
    },
    {
        id: 'fees',
        icon: CreditCard,
        title: 'Fees & Payments',
        content: 'You can check your school fees status in the "Fees" section. If you think a payment is not showing, please send a picture of your receipt to the school accountant or office.'
    },
    {
        id: 'profile',
        icon: User,
        title: 'Profile Information',
        content: 'Your profile shows your personal details. If your name, photo, or date of birth is wrong, you cannot change it yourself. Please report it to the school administration office.'
    },
    {
        id: 'announcements',
        icon: Megaphone,
        title: 'Announcements',
        content: 'Important school messages are in the "Notices" section. Always check it every morning. Urgent messages will have a red "Urgent" tag.'
    }
];

export const StudentHelp = () => {
    const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

    const toggleTopic = (id: string) => {
        setExpandedTopic(expandedTopic === id ? null : id);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* 1. Welcome Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <HelpCircle size={120} />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <HelpCircle className="text-primary-200" />
                        Need help? We're here for you.
                    </h1>
                    <p className="text-primary-100 text-lg max-w-2xl">
                        Find answers to common questions, contact support, or learn how to use the portal.
                        We want to make your school life easier!
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* 2. Common Help Topics (Left Column - 2/3 width) */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-xl font-bold text-slate-800">Common Help Topics</h2>
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full border border-slate-200">
                            Click to read
                        </span>
                    </div>

                    <div className="grid gap-4">
                        {helpTopics.map((topic) => (
                            <div
                                key={topic.id}
                                className={cn(
                                    "bg-white border rounded-xl overflow-hidden transition-all duration-200",
                                    expandedTopic === topic.id
                                        ? "border-primary-200 shadow-md ring-1 ring-primary-100"
                                        : "border-slate-200 shadow-sm hover:border-primary-200 hover:shadow-md"
                                )}
                            >
                                <button
                                    onClick={() => toggleTopic(topic.id)}
                                    className="w-full flex items-center justify-between p-5 text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                                            expandedTopic === topic.id ? "bg-primary-100 text-primary-600" : "bg-slate-100 text-slate-500"
                                        )}>
                                            <topic.icon size={20} />
                                        </div>
                                        <span className={cn(
                                            "font-semibold text-lg",
                                            expandedTopic === topic.id ? "text-primary-700" : "text-slate-700"
                                        )}>
                                            {topic.title}
                                        </span>
                                    </div>
                                    {expandedTopic === topic.id ? (
                                        <ChevronUp className="text-primary-400" />
                                    ) : (
                                        <ChevronDown className="text-slate-400" />
                                    )}
                                </button>
                                {expandedTopic === topic.id && (
                                    <div className="px-5 pb-5 pl-[4.5rem]">
                                        <p className="text-slate-600 leading-relaxed text-sm md:text-base bg-slate-50 p-4 rounded-lg border border-slate-100">
                                            {topic.content}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 3. Contact Support Form */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                <MessageCircle size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Contact School Support</h2>
                                <p className="text-sm text-slate-500">Send a message to the office or your teacher.</p>
                            </div>
                        </div>

                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">What can we help with?</label>
                                    <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-100 bg-slate-50 text-sm">
                                        <option>General Inquiry</option>
                                        <option>Corrections (Name, DOB)</option>
                                        <option>Report a Technical Issue</option>
                                        <option>Complaint</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">To Who?</label>
                                    <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-100 bg-slate-50 text-sm">
                                        <option>School Administrator</option>
                                        <option>Class Teacher</option>
                                        <option>IT Support</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Your Message</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-100 bg-slate-50 text-sm h-32 resize-none"
                                    placeholder="Type your message here clearly..."
                                ></textarea>
                            </div>
                            <div className="flex justify-end">
                                <Button className="pl-6 pr-8 gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg shadow-primary-500/20">
                                    <Send size={18} />
                                    Send Message
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column - Quick Info & Tips */}
                <div className="space-y-6">
                    {/* 4. Quick Help Info */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800">Quick Contact Info</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-green-100 p-2 rounded-lg text-green-600 mt-1">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">School Office</p>
                                    <p className="text-slate-800 font-medium">+233 20 123 4567</p>
                                    <p className="text-slate-400 text-xs">Mon - Fri, 8:00am - 4:00pm</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-orange-100 p-2 rounded-lg text-orange-600 mt-1">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Email Support</p>
                                    <p className="text-slate-800 font-medium tracking-tight">support@cschool.edu.gh</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 pb-6 pt-2">
                            <Button variant="outline" className="w-full justify-center">
                                View Staff Directory
                            </Button>
                        </div>
                    </div>

                    {/* 5. Help Tips */}
                    <div className="bg-yellow-50 rounded-2xl border border-yellow-100 p-6 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 text-yellow-500 opacity-10 rotate-12">
                            <Lightbulb size={120} />
                        </div>
                        <h3 className="font-bold text-yellow-800 flex items-center gap-2 mb-3 relative z-10">
                            <Lightbulb size={20} className="fill-yellow-500 text-yellow-600" />
                            Helpful Tips
                        </h3>
                        <ul className="space-y-3 relative z-10">
                            <li className="flex items-start gap-2 text-sm text-yellow-900/80">
                                <span className="bg-yellow-200 rounded-full w-1.5 h-1.5 mt-2 flex-shrink-0"></span>
                                Always check the <strong>"Notices"</strong> page every morning for school updates.
                            </li>
                            <li className="flex items-start gap-2 text-sm text-yellow-900/80">
                                <span className="bg-yellow-200 rounded-full w-1.5 h-1.5 mt-2 flex-shrink-0"></span>
                                If you miss a class, ask for notes from your friends or the teacher immediately.
                            </li>
                            <li className="flex items-start gap-2 text-sm text-yellow-900/80">
                                <span className="bg-yellow-200 rounded-full w-1.5 h-1.5 mt-2 flex-shrink-0"></span>
                                Keep your password secret. Do not share it with your friends.
                            </li>
                        </ul>
                    </div>

                    {/* 6. Announcements Reminder */}
                    <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/30">
                        <h3 className="font-bold text-lg mb-2">Check Notices!</h3>
                        <p className="text-blue-100 text-sm mb-4">
                            Did you know you can find all previous announcements in the Noticeboard section?
                        </p>
                        <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 border-transparent shadow-none">
                            Go to Notices
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
