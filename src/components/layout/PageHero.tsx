import { cn } from "@/lib/utils";

interface PageHeroProps {
    title: string;
    description?: string;
    className?: string;
    backgroundImage?: string;
}

export function PageHero({
    title,
    description,
    className,
    backgroundImage,
}: PageHeroProps) {
    return (
        <div
            className={cn(
                "relative flex w-full flex-col items-center justify-center overflow-hidden bg-muted py-24 text-center md:py-32",
                className
            )}
        >
            {backgroundImage && (
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
            )}
            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-heading text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
                    {title}
                </h1>
                {description && (
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
