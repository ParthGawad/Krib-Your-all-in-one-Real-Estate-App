import React from 'react'
import { useAuth } from "@clerk/expo"
import { Redirect, Slot } from 'expo-router'
import { useUserSync } from '@/hooks/useUserSync';

export default function RootLayout() {
    const { isSignedIn, isLoaded } = useAuth();
    // sync clerk user to supabase on launch
    useUserSync()
    if (!isLoaded) return null;

    if (!isSignedIn) {
        return <Redirect href={"/signUp" as any} />
    }

    return <Slot />;
}