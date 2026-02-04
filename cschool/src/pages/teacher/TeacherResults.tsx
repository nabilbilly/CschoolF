import { useNavigate } from 'react-router-dom';
import { Upload, FileBarChart, Trophy, AlertCircle } from 'lucide-react';

export const TeacherResults = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <Trophy className="text-primary-600" size={32} />
                    Results Management
                </h1>
                <p className="text-slate-500 mt-2 text-lg">
                    Manage student assessments and academic records securely.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upload Result Card */}
                <div
                    onClick={() => navigate('/teacher/results/upload')}
                    className="bg-white rounded-2xl border border-slate-200 p-8 hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/10 transition-all cursor-pointer group"
                >
                    <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Upload size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary-700 transition-colors">
                        Upload & Change Results
                    </h2>
                    <div className="text-slate-500 mb-8 leading-relaxed space-y-3">
                        <p>Enter and submit student scores for Class Tests, Mid-Terms, and Exams.</p>
                        <p className="text-sm font-medium text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100 flex gap-2 items-start">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            Note: Results cannot be changed after one week unless Admin is contacted with evidence.
                        </p>
                    </div>
                    <button className="w-full py-3 px-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl group-hover:bg-primary-600 group-hover:border-primary-600 group-hover:text-white transition-all">
                        Start Upload Process
                    </button>
                </div>

                {/* Display Result Card */}
                <div
                    onClick={() => navigate('/teacher/results/view')}
                    className="bg-white rounded-2xl border border-slate-200 p-8 hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/10 transition-all cursor-pointer group"
                >
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                        <FileBarChart size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-700 transition-colors">
                        Display Result
                    </h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        View class performance, generate broadsheets, and print terminal reports for your students.
                    </p>
                    <button className="w-full py-3 px-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all">
                        View Records
                    </button>
                </div>
            </div>
        </div>
    );
};
