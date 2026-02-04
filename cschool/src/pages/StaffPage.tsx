import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { PrincipalMessage } from '../components/staff/PrincipalMessage';
import { StaffGrid } from '../components/staff/StaffGrid';
import { SchoolGallery } from '../components/staff/SchoolGallery';
import { CTASection } from '../components/landing/CTASection';

const management = [
    { name: "Mr. Kwesi Appiah", role: "Vice Principal (Acad)", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" },
    { name: "Mrs. Vivian Osei", role: "Vice Principal (Admin)", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974&auto=format&fit=crop" },
    { name: "Dr. John Mensah", role: "Head of Sciences", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" },
    { name: "Ms. Sarah Boateng", role: "Head of Arts", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop" },
];

const teachers = [
    { name: "James Kweku", role: "Mathematics", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" },
    { name: "Linda Asante", role: "English Language", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop" },
    { name: "Robert Owusu", role: "Information Technology", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop" },
    { name: "Grace Addo", role: "Science", image: "https://images.unsplash.com/photo-1598550832205-d5937632faa8?q=80&w=2070&auto=format&fit=crop" },
];

export const StaffPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <Navbar />
            <main>
                <div className="bg-primary-900 py-20 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Team</h1>
                    <p className="text-xl text-primary-100">Meet the dedicated people shaping the future.</p>
                </div>

                <PrincipalMessage />

                <StaffGrid
                    title="Management Team"
                    description="Our administrative leaders ensuring operational excellence."
                    staff={management}
                />

                <StaffGrid
                    title="Teaching Staff"
                    description="Passionate educators committed to student success."
                    staff={teachers}
                />

                <SchoolGallery />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};
