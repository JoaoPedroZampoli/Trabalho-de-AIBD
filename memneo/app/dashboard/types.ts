// Types for the dashboard components

export interface Deck {
    id: number;
    name: string;
    cards: number;
    studied: number;
    accuracy: number;
    category: string;
}

export interface Category {
    id: number;
    name: string;
    decks: number;
    totalCards: number;
    color: string;
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
