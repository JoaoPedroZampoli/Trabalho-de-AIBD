interface QuickActionCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
}

export default function QuickActionCard({ 
    title, 
    description, 
    icon, 
    onClick, 
    variant = 'secondary' 
}: QuickActionCardProps) {
    const primaryClasses = "group bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-4 text-white hover:from-blue-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 h-full flex flex-col items-center justify-center text-center";
    const secondaryClasses = "group bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/8 transition-all duration-300 transform hover:scale-105 h-full flex flex-col items-center justify-center text-center";

    return (
        <button 
            onClick={onClick} 
            className={variant === 'primary' ? primaryClasses : secondaryClasses}
        >
            <div className={`w-12 h-12 ${variant === 'primary' ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-900/30'} rounded-lg flex items-center justify-center mb-3`}>
                <div className={variant === 'primary' ? 'text-white' : 'text-blue-600 dark:text-blue-400'}>
                    {icon}
                </div>
            </div>
            <div className="text-center">
                <h3 className={`text-sm font-semibold ${variant === 'primary' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-1`}>
                    {title}
                </h3>
                <p className={`${variant === 'primary' ? 'text-white/80' : 'text-gray-700 dark:text-white/80'} text-xs leading-tight`}>
                    {description}
                </p>
            </div>
        </button>
    );
}
