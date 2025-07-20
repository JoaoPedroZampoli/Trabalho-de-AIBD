import DeckCard from './DeckCard';
import { Deck } from '../types';

interface DecksViewProps {
    recentDecks: Deck[];
}

export default function DecksView({ recentDecks }: DecksViewProps) {
    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Meus Decks</h2>
                    <p className="text-gray-700 dark:text-white/80">Gerencie seus conjuntos de flashcards</p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Novo Deck</span>
                    </div>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentDecks.map((deck) => (
                    <DeckCard key={deck.id} deck={deck} variant="full" />
                ))}
            </div>
        </>
    );
}
