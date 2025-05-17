import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { EventSubscription } from "expo-modules-core";
import { registerForPushNotificationsAsync } from "../utils/registerForPushNotifcationsAsync";

interface UserFound {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    pushToken: string;
}
interface NotificationContextType {
    expoPushToken: string | null;
    notification: Notifications.Notification | null;
    error: Error | null;
    isExistingUser: boolean;
    userFound: UserFound
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
}) => {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [notification, setNotification] =
        useState<Notifications.Notification | null>(null);
    const [error, setError] = useState<any>(null);

    const notificationListener = useRef<EventSubscription>();
    const responseListener = useRef<EventSubscription>();
    // TODO: const lastNotificationResponse = Notifications.useLastNotificationResponse();
    const [isExistingUser, setIsExistingUser] = useState(false);
    const [userFound, setUserFound] = useState({ firstName: '', lastName: '', mobileNumber: '', pushToken: '' })

    const handleNotificationTap = async () => {
        try {
            const result = await fetch('http://192.168.1.122:3000/notifyseconduser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify({
                //   notificationId: response.notification.request.identifier,
                //   action: response.actionIdentifier,
                //   data: response.notification.request.content.data,
                //   timestamp: new Date().toISOString(),
                // }),
                body: JSON.stringify({
                    acknowledged: true
                }),
            });

            return result
        } catch (error) {
            console.error("POST Error:", error);
        }
    };

    const checkIsExistingUser = async (token: string) => {
        try {
            const result = await fetch(`http://192.168.1.122:3000/users/by-push-token/${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await result.json();
            if (data.pushToken) {
                setUserFound({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    mobileNumber: data.mobileNumber,
                    pushToken: data.pushToken
                })
                setIsExistingUser(true)
            } else {
                setIsExistingUser(false)
            }
            return data;
        } catch (error) {
            setIsExistingUser(false)
            console.log(error)
        }
    }

    const register = async () => {
        try {
            const token = await registerForPushNotificationsAsync();
            setExpoPushToken(token)
            await checkIsExistingUser(token)
        } catch (error) {
            setError(error)
        }
    }

    useEffect(() => {
        register()
        // called whenever a notification is received while the app is running/in the foreground
        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                // console.log("🔔 Notification Received test: ", JSON.stringify(notification, null, 2));
                setNotification(notification);
            });

        // // called whenever the user taps on the notification while the app is running in the background
        responseListener.current =
            Notifications.addNotificationResponseReceivedListener((response) => {
                console.log(
                    "🔔 Notification Response some: user interacts with a notification ",
                    JSON.stringify(response, null, 2)
                );
                handleNotificationTap()
                console.log('after handle notification')
            });

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(
                    notificationListener.current
                );
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    // useEffect(() => {
    //     if (lastNotificationResponse?.notification) {
    //         console.log('Last response interacted:', JSON.stringify(lastNotificationResponse.notification, null, 2));
    //         // You can navigate or handle data here
    //         setNotification(lastNotificationResponse?.notification)
    //     }
    // }, [lastNotificationResponse])

    return (
        <NotificationContext.Provider
            value={{ expoPushToken, notification, error, isExistingUser, userFound }}
        >
            {children}
        </NotificationContext.Provider>
    );
};