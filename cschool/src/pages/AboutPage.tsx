import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AboutHero } from '../components/about/AboutHero';
import { MissionVisionValues } from '../components/about/MissionVisionValues';
import { HistorySection } from '../components/about/HistorySection';
import { AchievementsSection } from '../components/about/AchievementsSection';
import { StudentLifeGallery } from '../components/about/StudentLifeGallery';
import { WhyTrustUs } from '../components/about/WhyTrustUs';
import { CTASection } from '../components/landing/CTASection';

export const AboutPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <Navbar />
            <main>
                <AboutHero />
                <MissionVisionValues />
                <HistorySection />
                <StudentLifeGallery />
                <AchievementsSection />
                <WhyTrustUs />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};
