import { useAuth } from '@clerk/expo'
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) return null;

    if (isSignedIn) {
        return <Redirect href={"/(root)/(tabs)" as any} />
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="signUp" />
            <Stack.Screen name="signIn" />
        </Stack>
    );
}

