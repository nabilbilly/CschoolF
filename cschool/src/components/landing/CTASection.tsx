import { Button } from '../common/Button';
import { ArrowRight, School, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CTASection = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-center overflow-hidden relative">
                    {/* Decorative circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                            Give Your Child the Best Start in Life
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            Enroll today and join a school community committed to growth, discipline, and lifelong learning.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link to="/admission/verification">
                                <Button size="lg" variant="default" className="w-full sm:w-auto text-lg bg-white text-slate-900 hover:bg-slate-100 hover:text-slate-900 border-none transition-colors">
                                    <School className="mr-2 h-5 w-5" />
                                    Apply for Admission
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg border-slate-700 text-white hover:bg-slate-800 hover:text-white">
                                    <ArrowRight className="mr-2 h-5 w-5" />
                                    Visit the School
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button size="lg" variant="ghost" className="w-full sm:w-auto text-lg text-slate-300 hover:text-white hover:bg-slate-800">
                                    <Phone className="mr-2 h-5 w-5" />
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
