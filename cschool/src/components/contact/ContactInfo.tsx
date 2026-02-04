import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const ContactInfo = () => {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h3>
                <p className="text-slate-600 mb-8">
                    Visit our campus or reach out via phone or email. Our administration office is open during school hours.
                </p>
            </div>

            <div className="space-y-6">
                {[
                    { icon: MapPin, title: "Address", content: ["123 Academy Road", "East Legon, Accra - Ghana"] },
                    { icon: Phone, title: "Phone", content: ["+233 24 123 4567", "+233 50 987 6543"] },
                    { icon: Mail, title: "Email", content: ["admissions@cschool.edu.gh", "info@cschool.edu.gh"] },
                    { icon: Clock, title: "Office Hours", content: ["Mon - Fri: 7:30 AM - 4:30 PM", "Sat: 9:00 AM - 1:00 PM"] },
                ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                            <item.icon size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                            {item.content.map((line, i) => (
                                <p key={i} className="text-slate-600">{line}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
