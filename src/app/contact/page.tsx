export default function ContactPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-8">
            <h1 className="text-5xl font-bold mb-6 text-primary">Nous Contacter</h1>
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl">
                Vous avez une question ou souhaitez prendre rendez-vous ? Contactez-nous :
            </p>
            <div className="space-y-4 text-center">
                <p className="text-xl">
                    📞 <a href="tel:+1234567890" className="hover:underline">+1 (234) 567-890</a>
                </p>
                <p className="text-xl">
                    📧 <a href="mailto:info@drmartinclinic.com" className="hover:underline">info@drmartinclinic.com</a>
                    <p className="text-xl">📍 13 place Alphone Fiquet, Amiens</p>
                </p>
            </div>
            {/* Future contact form placeholder */}
            <div className="mt-12 w-full max-w-md">
                <p className="text-muted-foreground text-center">
                    (Un formulaire de contact sera bientôt ajouté ici.)
                </p>
            </div>
        </main>
    );
}
