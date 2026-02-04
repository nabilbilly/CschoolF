import { useState, useEffect } from 'react';
import { Menu, X, School, LogIn } from 'lucide-react';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Features', href: '/features' },
    { name: 'Staff', href: '/staff' },
    { name: 'Contact', href: '/contact' },
];

export const Navbar = () => {
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled ? "glass-nav py-3" : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary-600 rounded-lg text-white">
                            <School size={24} />
                        </div>
                        <span className={cn(
                            "text-xl font-bold tracking-tight transition-colors",
                            isScrolled ? "text-slate-900" : "text-white"
                        )}>
                            cschool
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors relative",
                                        isActive
                                            ? "text-primary-600 font-semibold"
                                            : isScrolled ? "text-slate-600 hover:text-primary-500" : "text-slate-200 hover:text-white"
                                    )}
                                >
                                    {link.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 rounded-full"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                        <Link to="/admission/verification">
                            <Button variant="premium" size="sm">
                                Admission
                            </Button>
                        </Link>
                        <Link to="/student/login">
                            <Button variant={isScrolled ? "default" : "secondary"} size="sm" className="gap-2">
                                <LogIn size={16} />
                                Portal Login
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className={cn(
                            "md:hidden p-2 transition-colors mr-2",
                            isScrolled || isMobileMenuOpen ? "text-slate-900" : "text-white"
                        )}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-slate-200"
                    >
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        className={cn(
                                            "text-sm font-medium py-2 px-4 rounded-lg transition-colors",
                                            isActive
                                                ? "bg-primary-50 text-primary-600"
                                                : "text-slate-600 hover:text-primary-600 hover:bg-slate-50"
                                        )}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                            <Link to="/admission/verification">
                                <Button variant="premium" size="sm">
                                    Admission
                                </Button>
                            </Link>
                            <Link to="/student/login" className="w-full">
                                <Button className="w-full gap-2">
                                    <LogIn size={16} />
                                    Portal Login
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
