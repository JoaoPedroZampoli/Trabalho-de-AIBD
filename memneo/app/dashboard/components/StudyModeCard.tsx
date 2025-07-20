interface StudyModeCardProps {
    title: string;
    description: string;
    bgColor: string;
    hoverColor: string;
    onClick?: () => void;
}

export default function StudyModeCard({ 
    title, 
    description, 
    bgColor, 
    hoverColor, 
    onClick 
}: StudyModeCardProps) {
    return (
        <div 
            className={`${bgColor} rounded-lg p-4 text-white cursor-pointer ${hoverColor} transition-all duration-300`}
            onClick={onClick}
        >
            <h4 className="font-semibold mb-2">{title}</h4>
            <p className="text-white/80 text-sm">{description}</p>
        </div>
    );
}
