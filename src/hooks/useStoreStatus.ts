import { useState, useEffect } from 'react';
import { JSON_LD } from '@/data/schema';

interface StoreStatus {
    isOpen: boolean;
    nextOpenTime: string;
    message: string;
}

const DAYS_MAP: { [key: string]: number } = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
};

export function useStoreStatus(): StoreStatus {
    const [status, setStatus] = useState<StoreStatus>({
        isOpen: true,
        nextOpenTime: '',
        message: ''
    });

    useEffect(() => {
        const checkStoreStatus = () => {
            const now = new Date();
            const currentDay = now.getDay();
            const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight

            const openingHours = JSON_LD.openingHoursSpecification;

            // Find today's schedule
            let todaySchedule = null;
            for (const schedule of openingHours) {
                if (Array.isArray(schedule.dayOfWeek)) {
                    const dayNumbers = schedule.dayOfWeek.map(day => DAYS_MAP[day]);
                    if (dayNumbers.includes(currentDay)) {
                        todaySchedule = schedule;
                        break;
                    }
                }
            }

            if (!todaySchedule) {
                setStatus({
                    isOpen: false,
                    nextOpenTime: 'Tomorrow',
                    message: 'We are currently closed today.'
                });
                return;
            }

            // Parse opening and closing times
            const [openHour, openMin] = todaySchedule.opens.split(':').map(Number);
            const openTime = openHour * 60 + openMin;

            // Handle closing time (00:00 means midnight = 24:00 = next day)
            let closeTime: number;
            if (todaySchedule.closes === '00:00') {
                closeTime = 24 * 60; // End of day
            } else {
                const [closeHour, closeMin] = todaySchedule.closes.split(':').map(Number);
                closeTime = closeHour * 60 + closeMin;
            }

            const isOpen = currentTime >= openTime && currentTime < closeTime;

            if (isOpen) {
                setStatus({
                    isOpen: true,
                    nextOpenTime: '',
                    message: `Open until ${formatTime(todaySchedule.closes)}`
                });
            } else {
                // Determine next opening time
                let nextOpenMessage = '';
                if (currentTime < openTime) {
                    // Haven't opened today yet
                    nextOpenMessage = `Opens today at ${formatTime(todaySchedule.opens)}`;
                } else {
                    // Closed for today, find next opening day
                    const nextDay = (currentDay + 1) % 7;
                    let nextSchedule = null;

                    for (const schedule of openingHours) {
                        if (Array.isArray(schedule.dayOfWeek)) {
                            const dayNumbers = schedule.dayOfWeek.map(day => DAYS_MAP[day]);
                            if (dayNumbers.includes(nextDay)) {
                                nextSchedule = schedule;
                                break;
                            }
                        }
                    }

                    if (nextSchedule) {
                        const dayName = Object.keys(DAYS_MAP).find(key => DAYS_MAP[key] === nextDay);
                        nextOpenMessage = `Opens ${dayName} at ${formatTime(nextSchedule.opens)}`;
                    } else {
                        nextOpenMessage = 'Opens soon';
                    }
                }

                setStatus({
                    isOpen: false,
                    nextOpenTime: nextOpenMessage,
                    message: `We are currently closed. ${nextOpenMessage}`
                });
            }
        };

        checkStoreStatus();
        // Check every minute
        const interval = setInterval(checkStoreStatus, 60000);

        return () => clearInterval(interval);
    }, []);

    return status;
}

function formatTime(time: string): string {
    if (time === '00:00') return '12:00 AM';

    const [hour, min] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

    return `${displayHour}:${min.toString().padStart(2, '0')} ${period}`;
}
