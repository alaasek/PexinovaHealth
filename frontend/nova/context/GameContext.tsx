import React, { createContext, useState, useContext, ReactNode } from 'react';

// Types
export type MedicineStatus = 'done' | 'pending' | 'not_yet';

export interface Medicine {
    id: number;
    name: string;
    time: string;
    minutes: number;
    taken: boolean;
    dosage?: string;
    category?: 'Critical' | 'Time-sensitive' | 'Flexible';
}

interface GameContextType {
    medicines: Medicine[];
    score: number;
    bullets: number; // Number of "shots" earned by taking meds but not yet used
    markMedicineTaken: (id: number) => void;
    addMedicine: (med: Omit<Medicine, 'id' | 'taken' | 'minutes'>) => void;
    updateMedicineTime: (id: number, time: string) => void;
    shootAlien: () => void;
    resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    // Initial Medicines Data
    const initialMedicines: Medicine[] = [
        { id: 999, name: 'Test Med', time: '10:00 am', minutes: 600, taken: false, category: 'Flexible' }
    ];

    const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
    const [score, setScore] = useState(0);
    const [bullets, setBullets] = useState(0);

    const markMedicineTaken = (id: number) => {
        setMedicines(prev => prev.map(med => {
            if (med.id === id && !med.taken) {
                // Earn a bullet when marking as taken
                setBullets(b => b + 1);
                return { ...med, taken: true };
            }
            return med;
        }));
    };

    const addMedicine = (newMed: Omit<Medicine, 'id' | 'taken' | 'minutes'>) => {
        console.log("Adding Medicine:", newMed);

        let minutes = 0;
        // Robust time parsing
        try {
            if (newMed.time) {
                const parts = newMed.time.split(' '); // Expected "HH:MM am"
                if (parts.length > 0) {
                    const timeParts = parts[0].split(':');
                    let h = parseInt(timeParts[0]) || 0;
                    const m = parseInt(timeParts[1]) || 0;
                    const isPm = parts[1] && parts[1].toLowerCase() === 'pm';
                    const isAm = parts[1] && parts[1].toLowerCase() === 'am';

                    if (isPm && h < 12) h += 12;
                    if (isAm && h === 12) h = 0;

                    minutes = h * 60 + m;
                }
            }
        } catch (e) {
            console.warn("Time parsing failed, defaulting to 0", e);
        }

        const medToAdd = {
            id: Date.now(),
            ...newMed,
            minutes: minutes,
            taken: false,
        };

        setMedicines(prev => [...prev, medToAdd]);
    };

    const updateMedicineTime = (id: number, time: string) => {
        let minutes = 0;
        try {
            const parts = time.split(' ');
            if (parts.length > 0) {
                const timeParts = parts[0].split(':');
                let h = parseInt(timeParts[0]) || 0;
                const m = parseInt(timeParts[1]) || 0;
                const isPm = parts[1] && parts[1].toLowerCase() === 'pm';
                const isAm = parts[1] && parts[1].toLowerCase() === 'am';
                if (isPm && h < 12) h += 12;
                if (isAm && h === 12) h = 0;
                minutes = h * 60 + m;
            }
        } catch (e) { }

        setMedicines(prev => prev.map(med =>
            med.id === id ? { ...med, time, minutes } : med
        ));
    };

    const shootAlien = () => {
        if (bullets > 0) {
            setScore(s => s + 1);
            setBullets(b => b - 1);
        }
    };

    const resetGame = () => {
        setScore(0);
        setBullets(0);
        setMedicines(initialMedicines);
    }

    return (
        <GameContext.Provider value={{ medicines, score, bullets, markMedicineTaken, addMedicine, updateMedicineTime, shootAlien, resetGame }}>
            {children}
        </GameContext.Provider>
    );
};



export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
