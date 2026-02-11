import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LimitedInputProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    maxLength: number;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    error?: string;
    className?: string;
    textarea?: boolean;
    rows?: number;
    icon?: React.ReactNode;
    numericOnly?: boolean;
}

export const LimitedInput: React.FC<LimitedInputProps> = ({
    label,
    value,
    onChange,
    maxLength,
    placeholder,
    type = 'text',
    disabled = false,
    error,
    className = '',
    textarea = false,
    rows = 3,
    icon,
    numericOnly = false
}) => {
    const remaining = maxLength - value.length;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let val = e.target.value;
        if (numericOnly) {
            val = val.replace(/[^0-9]/g, '');
        }
        onChange(val);
    };

    return (
        <div className="space-y-2 w-full">
            {(label || maxLength) && (
                <div className="flex justify-between items-end mb-1">
                    {label ? (
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest leading-none">
                            {label}
                        </label>
                    ) : <span></span>}
                    <span className={cn(
                        "text-[9px] font-black tracking-tighter px-2 py-0.5 rounded-full transition-colors",
                        remaining < 0 ? "bg-rose-100 text-rose-600" : remaining < 10 ? "bg-amber-100 text-amber-600" : "text-slate-300"
                    )}>
                        {value.length}/{maxLength}
                    </span>
                </div>
            )}

            <div className="relative group">
                {icon && (
                    <div className={cn(
                        "absolute left-6 top-1/2 -translate-y-1/2 transition-colors",
                        error || remaining < 0 ? "text-rose-400" : "text-slate-300 group-focus-within:text-primary-600"
                    )}>
                        {icon}
                    </div>
                )}

                {textarea ? (
                    <textarea
                        value={value}
                        onChange={handleChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        rows={rows}
                        className={cn(
                            "w-full bg-slate-50 border-2 border-slate-200 rounded-[1.25rem] px-8 py-5 outline-none transition-all font-bold italic resize-none",
                            "focus:bg-white",
                            icon && "pl-14",
                            error || remaining < 0 ? "border-rose-300 bg-rose-50/30 focus:border-rose-500" : "focus:border-primary-600",
                            className
                        )}
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={handleChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={cn(
                            "w-full h-16 bg-slate-50 border-2 border-slate-200 rounded-[1.25rem] px-8 outline-none transition-all font-bold italic",
                            "focus:bg-white",
                            icon && "pl-14",
                            error || remaining < 0 ? "border-rose-300 bg-rose-50/30 focus:border-rose-500" : "focus:border-primary-600",
                            className
                        )}
                    />
                )}
            </div>

            <AnimatePresence>
                {(error || remaining < 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex flex-col gap-1 ml-2"
                    >
                        {error && (
                            <p className="text-[10px] font-black uppercase text-rose-500 tracking-widest flex items-center gap-1">
                                <AlertCircle size={10} /> {error}
                            </p>
                        )}
                        {remaining < 0 && (
                            <p className="text-[10px] font-black uppercase text-rose-600 tracking-widest flex items-center gap-1">
                                <AlertCircle size={10} /> Character limit exceeded by {Math.abs(remaining)}
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
