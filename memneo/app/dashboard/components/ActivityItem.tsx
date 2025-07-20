interface ActivityItemProps {
    icon: React.ReactNode;
    iconBgColor: string;
    iconColor: string;
    title: string;
    time: string;
}

export default function ActivityItem({ 
    icon, 
    iconBgColor, 
    iconColor, 
    title, 
    time 
}: ActivityItemProps) {
    return (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
            <div className={`w-8 h-8 ${iconBgColor} rounded-full flex items-center justify-center`}>
                <div className={iconColor}>
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
                <p className="text-xs text-gray-600 dark:text-white/60">{time}</p>
            </div>
        </div>
    );
}
