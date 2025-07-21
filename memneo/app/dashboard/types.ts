// Types for the dashboard components

export interface Deck {
    id: string | number;
    name: string;
    cards: number;
    studied: number;
    accuracy: number;
    category: string;
}

export interface Category {
    _id?: string;
    id?: string | number;
    name: string;
    description?: string;
    decks?: number;
    totalCards?: number;
    color?: string;
    icon?: string;
}

export interface StudyStats {
    totalCards: number;
    studiedToday: number;
    streak: number;
    accuracy: number;
}

export interface ActivityItem {
    title: string;
    time: string;
    iconBgColor: string;
    iconColor: string;
    icon: React.ReactNode;
}

export type ViewType = 'overview' | 'decks' | 'study' | 'categories' | 'analytics';
