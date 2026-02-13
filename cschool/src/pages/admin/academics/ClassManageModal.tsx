import { useState, useEffect } from 'react';
import { X, Plus, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/common/Button';
import type { ClassRoom } from '../../../services/academicsService';
import { academicsService } from '../../../services/academicsService';

interface ClassManageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    classRoom?: ClassRoom | null;
}

export const ClassManageModal = ({ isOpen, onClose, onSave, classRoom }: ClassManageModalProps) => {
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [level, setLevel] = useState('Primary');
    const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
    const [streams, setStreams] = useState<string[]>([]);
    const [newStreamName, setNewStreamName] = useState('');

    useEffect(() => {
        if (classRoom) {
            setName(classRoom.name);
            setLevel(classRoom.level);
            // Assuming status might be added to model later or using Active by default
            setStreams(classRoom.streams?.map(s => s.name) || []);
        } else {
            setName('');
            setLevel('Primary');
            setStatus('ACTIVE');
            setStreams([]);
        }
        setError(null);
    }, [classRoom, isOpen]);

    const handleAddStream = () => {
        if (!newStreamName.trim()) return;
        if (streams.includes(newStreamName.trim())) {
            setError('Stream already added');
            return;
        }
        setStreams([...streams, newStreamName.trim()]);
        setNewStreamName('');
        setError(null);
    };

    const handleRemoveStream = (streamToRemove: string) => {
        setStreams(streams.filter(s => s !== streamToRemove));
    };

    const handleSave = async () => {
        if (!name.trim()) {
            setError('Class name is required');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            let savedClass: ClassRoom;
            if (classRoom) {
                // Update
                savedClass = await academicsService.updateClass(classRoom.id, { name, level });

                // Track streams to add/remove
                const existingStreamNames = classRoom.streams?.map(s => s.name) || [];
                const streamsToAdd = streams.filter(s => !existingStreamNames.includes(s));
                const streamsToRemove = classRoom.streams?.filter(s => !streams.includes(s.name)) || [];

                // Delete removed streams
                for (const s of streamsToRemove) {
                    try {
                        await academicsService.deleteStream(s.id);
                    } catch (err: any) {
                        console.error(`Failed to delete stream ${s.name}:`, err);
                        // We might continue even if one fails (e.g. if it has admissions)
                    }
                }

                // Add new streams
                for (const sName of streamsToAdd) {
                    await academicsService.createStream({ class_id: classRoom.id, name: sName });
                }
            } else {
                // Create
                savedClass = await academicsService.createClass({ name, level });

                // Add initial streams
                for (const sName of streams) {
                    await academicsService.createStream({ class_id: savedClass.id, name: sName });
                }
            }

            onSave();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save class');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">
                        {classRoom ? 'Edit Class' : 'Create New Class'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Level Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Education Level</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['Primary', 'JHS', 'SHS'].map((l) => (
                                <button
                                    key={l}
                                    type="button"
                                    onClick={() => setLevel(l)}
                                    className={cn(
                                        "py-2 px-3 rounded-lg border text-sm font-medium transition-all",
                                        level === l
                                            ? "bg-primary-50 border-primary-200 text-primary-700 shadow-sm"
                                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                    )}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Class Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class Name</label>
                        <input
                            type="text"
                            placeholder="e.g. JHS 1 or Primary 4"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                        <select
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-white"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>

                    {/* Streams Management */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Manage Streams</label>
                            <span className="text-[10px] text-slate-400 font-medium">Add streams like A, B, C or Gold, Blue</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Stream name..."
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                                value={newStreamName}
                                onChange={(e) => setNewStreamName(e.target.value.toUpperCase())}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddStream()}
                            />
                            <Button type="button" size="sm" onClick={handleAddStream} className="rounded-xl">
                                <Plus size={18} />
                                Add
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                            <AnimatePresence>
                                {streams.map((s) => (
                                    <motion.span
                                        key={s}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold border border-slate-200 group"
                                    >
                                        {s}
                                        <button
                                            onClick={() => handleRemoveStream(s)}
                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                            {streams.length === 0 && (
                                <p className="text-xs text-slate-400 italic">No streams added yet</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="min-w-[120px]"
                    >
                        {isSaving ? (
                            <Loader2 size={18} className="animate-spin mr-2" />
                        ) : (
                            <CheckCircle2 size={18} className="mr-2" />
                        )}
                        {classRoom ? 'Save Changes' : 'Create Class'}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
