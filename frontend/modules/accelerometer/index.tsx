import { ThemedText } from '@/components/ThemedText';
import { API_URL } from '@/utils';
import { Accelerometer } from 'expo-sensors';
import { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { User } from "@/types/index"

export default function MotionSensor({ user }: { user: User }) {
    const [data, setData] = useState({ x: 0, y: 0, z: 0 });
    const [moved, setMoved] = useState(false);
    const lastSentTime = useRef<number>(0);
    // prevent spamming server
    const sendMovementToServer = async (currentDateTime: number) => {
        try {
            console.log('userrr', user)
            const response = await fetch(`${API_URL}/movements/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    timestamp: currentDateTime
                }),
            });

            if (!response.ok) {
                console.error('Failed to send movement data', response.status);
            }
        } catch (error) {
            console.error('Error sending data:', error);
        }
    };

    useEffect(() => {
        const subscription = Accelerometer.addListener(accelerometerData => {
            const { x, y, z } = accelerometerData;

            const delta = Math.sqrt(
                (x - data.x) ** 2 +
                (y - data.y) ** 2 +
                (z - data.z) ** 2
            );

            console.log('delta', delta)
            if (delta > 0.2) { // tune this threshold
                setMoved(true);
                const diffDate = Date.now() - lastSentTime.current
                console.log('diffDate', diffDate)
                if (diffDate > 5000) {
                    console.log('sending movement to server')
                    lastSentTime.current = Date.now();
                    sendMovementToServer(lastSentTime.current);

                }
                console.log('NOT sending movement to server')
                setData({ x, y, z });
            } else {
                setMoved(false);
            }
            console.log('moved', moved)

        });

        Accelerometer.setUpdateInterval(500); // ms

        return () => {
            subscription && subscription.remove();
        };
    }, [moved, setMoved, data]);
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ThemedText>{moved ? 'Phone Moved!' : 'Stationary'}</ThemedText>
        </View>
    );
}