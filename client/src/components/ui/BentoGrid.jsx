import { cn } from "../../lib/utils";

export const BentoGrid = ({ className, children }) => {
    return (
        <div
            className={cn(
                "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3 [&>*]:[grid-column:inherit] [&>*]:[grid-row:inherit]",
                className,
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
}) => {
    return (
        <div
            className={cn(
                "group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-2xl border-2 border-white/40 backdrop-blur-xl bg-white/60 p-6 shadow-lg transition duration-200 hover:shadow-2xl hover:-translate-y-1 hover:bg-white/70 hover:border-white/60",
                className,
            )}
        >
            {header}
            <div className="transition duration-200 group-hover/bento:translate-x-2">
                {icon}
                <div className="mt-2 mb-2 font-sans font-bold text-gray-800">
                    {title}
                </div>
                <div className="font-sans text-sm font-normal text-gray-700">
                    {description}
                </div>
            </div>
        </div>
    );
};
