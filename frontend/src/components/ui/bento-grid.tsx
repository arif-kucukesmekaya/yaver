import { cn } from "@/lib/utils";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[25rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "row-span-1 rounded-3xl group/bento hover:shadow-2xl hover:shadow-indigo-500/10 transition duration-200 shadow-input dark:shadow-none p-6 dark:bg-black/40 dark:border-white/10 bg-white border border-transparent justify-between flex flex-col space-y-4 relative overflow-hidden backdrop-blur-sm",
                className
            )}
        >
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/bento:animate-shimmer z-0 pointer-events-none" />

            <div className="relative z-10">
                {header}
                <div className="group-hover/bento:translate-x-2 transition duration-200 mt-4">
                    {icon}
                    <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
                        {title}
                    </div>
                    <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
                        {description}
                    </div>
                </div>
            </div>
        </div>
    );
};
