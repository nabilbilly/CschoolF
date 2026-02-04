import { useState } from 'react';
import { Button } from '../common/Button';
import { Send } from 'lucide-react';

export const ContactForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate submit
        setTimeout(() => {
            setIsLoading(false);
            alert("Message sent successfully!");
        }, 1500);
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                        <input type="text" className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <input type="email" className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="john@example.com" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                    <input type="tel" className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="+233 24 123 4567" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Subject</label>
                    <select className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none">
                        <option>General Inquiry</option>
                        <option>Admissions</option>
                        <option>Fees & Finance</option>
                        <option>Report an Issue</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Message</label>
                    <textarea className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none min-h-[150px]" placeholder="How can we help you?" required></textarea>
                </div>

                <Button className="w-full" size="lg" isLoading={isLoading}>
                    <Send className="mr-2 h-4 w-4" /> Send Message
                </Button>
            </form>
        </div>
    );
};
