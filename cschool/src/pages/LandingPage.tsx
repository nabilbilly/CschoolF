import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { HeroCarousel } from '../components/landing/HeroCarousel'
import { AboutSection } from '../components/landing/AboutSection'
import { FeaturesSection } from '../components/landing/FeaturesSection'
import { StatsSection } from '../components/landing/StatsSection'
import { StudentLifeSection } from '../components/landing/StudentLifeSection'
import { FacilitiesSection } from '../components/landing/FacilitiesSection'
import { ParentsSection } from '../components/landing/ParentsSection'
import { AdmissionsSection } from '../components/landing/AdmissionsSection'
import { TestimonialsSection } from '../components/landing/TestimonialsSection'
import { CTASection } from '../components/landing/CTASection'

export const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <Navbar />
            <main>
                <HeroCarousel />
                <AboutSection />
                <FeaturesSection />
                <StatsSection />

                {/* New Sections */}
                <StudentLifeSection />
                <FacilitiesSection />
                <ParentsSection />
                <AdmissionsSection />
                <TestimonialsSection />

                <CTASection />
            </main>
            <Footer />
        </div>
    )
}
