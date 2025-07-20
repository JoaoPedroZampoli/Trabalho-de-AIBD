interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    bgColor: string;
    iconBgColor: string;
    iconColor: string;
}

export default function StatsCard({ 
    title, 
    value, 
    icon, 
    bgColor, 
    iconBgColor, 
    iconColor 
}: StatsCardProps) {
    return (
        <div className={`${bgColor} backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-white/10`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-white/60">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
                <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
                    <div className={iconColor}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
}
