import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FeaturesHero } from '../components/features/FeaturesHero';
import { FeatureGrid } from '../components/features/FeatureGrid';
import { FeatureDetails } from '../components/features/FeatureDetails';
import { CTASection } from '../components/landing/CTASection';

export const FeaturesPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <Navbar />
            <main>
                <FeaturesHero />
                <FeatureGrid />
                <FeatureDetails />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};
