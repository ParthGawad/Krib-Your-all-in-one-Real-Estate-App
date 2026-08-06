import React from 'react'
import { useAuth } from "@clerk/expo"
import { Redirect, Slot } from 'expo-router'

export default function _layout() {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) return null;

    if (!isSignedIn) {
        return <Redirect href={"/signUp" as any} />
    }

    return <Slot />;
}