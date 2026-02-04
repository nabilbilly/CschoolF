import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                {/* Visual element */}
                <div className="relative mb-8 flex justify-center">
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="text-primary-600 opacity-20"
                    >
                        <Ghost size={200} />
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-[120px] font-black text-slate-900 leading-none select-none opacity-10">
                            404
                        </h1>
                    </div>
                </div>

                {/* Content */}
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                    Oops! Page Not Found
                </h2>
                <p className="text-slate-600 mb-10 max-w-md mx-auto text-lg">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full px-8"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="mr-2" size={20} />
                        Go Back
                    </Button>
                    <Button
                        size="lg"
                        className="rounded-full px-8 bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-200"
                        onClick={() => navigate('/student/login')}
                    >
                        <Home className="mr-2" size={20} />
                        Go to Portal
                    </Button>
                </div>

                {/* School branding */}
                <div className="mt-20">
                    <p className="text-slate-400 font-medium">
                        cschool &bull; Management Portal
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
