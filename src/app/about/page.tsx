export default function AboutPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-8">
            <h1 className="text-5xl font-bold mb-6 text-primary">À Propos du Dr. Martin</h1>
            <p className="text-lg text-muted-foreground max-w-2xl text-center">
                La clinique du Dr Martin fournit des soins médicaux compatissants et de pointe depuis plus de 20 ans.
                Notre mission est de combiner l'expertise avec une philosophie axée sur le patient, en veillant à ce que chaque visite soit personnelle et sans stress.
            </p>
        </main>
    );
}
