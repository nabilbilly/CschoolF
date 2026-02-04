export const MapSection = () => {
    return (
        <section className="h-[400px] w-full bg-slate-100 relative">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254316.51659858343!2d-0.21921605!3d5.59250005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9133bd53856d%3A0xe542618991a0c8e!2sAccra!5e0!3m2!1sen!2sgh!4v1715334526543!5m2!1sen!2sgh"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="filter grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>
        </section>
    );
};
