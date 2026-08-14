import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/expo'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Profile() {

    const { signOut } = useAuth()

    const logout = async () => {
        try {
            await signOut()
            router.replace('/signIn')
        } catch (error: any) {
            console.error("Error signing out : ", error.message)
        }
    }

    return (
        <SafeAreaView>
            {/* logout button */}
            <TouchableOpacity
                activeOpacity={0.7}
                // className='border border-gray-300 rounded-lg px-4 py-3 bg-blue-400 absolute bottom-10'
                onPress={logout}
            >
                <Text className='text-black text-lg font-semibold'>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}