import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ContactHero } from '../components/contact/ContactHero';
import { ContactForm } from '../components/contact/ContactForm';
import { ContactInfo } from '../components/contact/ContactInfo';
import { MapSection } from '../components/contact/MapSection';

export const ContactPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <Navbar />
            <main>
                <ContactHero />
                <section className="py-20">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                            <ContactInfo />
                            <ContactForm />
                        </div>
                    </div>
                </section>
                <MapSection />
            </main>
            <Footer />
        </div>
    );
};
