import Propertycard from '@/components/Propertycard'
import { useSupaBase } from '@/hooks/useSupaBase'
import { Property } from '@/types/interface'
import { useAuth } from '@clerk/expo'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// Interface representing a saved property record joined with the property details
interface SavedProperty {
    id: string;
    property_id: string;
    properties: Property
}

// Saved properties screen component
export default function save() {

    // Retrieve authenticated Clerk user ID
    const { userId } = useAuth()
    // Authenticated Supabase client instance
    const authSupabase = useSupaBase()

    const router = useRouter()
    // List of saved properties and loading state
    const [saved, setSaved] = useState<SavedProperty[]>([])
    const [loading, setLoading] = useState(false)

    // Fetches all saved properties for the logged-in user from Supabase
    const fetchSaved = useCallback(async () => {
        // Return if user is not authenticated
        if (!userId) return;
        setLoading(true)

        // Query saved properties and join the associated property data
        const { data } = await authSupabase
            .from('saved_properties')
            .select('id, property_id, properties (*)')
            .eq('user_clerk_id', userId)
            .order('id', { ascending: false })

        // Update state with fetched properties
        setSaved((data as unknown as SavedProperty[]) ?? [])
        setLoading(false)
    }, [userId])

    // Re-fetch saved properties whenever the screen gains focus
    useFocusEffect(
        useCallback(() => {
            fetchSaved()
        }, [fetchSaved])
    )

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header: Title and saved properties counter */}
            <View className="px-5 pt-4 pb-3">
                <Text className="text-2xl font-bold text-gray-900">Saved</Text>
                {!loading && (
                    <Text className="text-sm text-gray-400 mt-1">
                        {saved.length} {saved.length === 1 ? "property" : "properties"}{" "}
                        saved
                    </Text>
                )}
            </View>

            {/* Display loader while fetching; otherwise render list or empty state */}
            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#2563EB" />
                </View>
            ) : (
                <FlatList
                    data={saved}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Propertycard
                            property={item.properties}
                            // Optimistically remove property from list when unsaved
                            onUnsave={() =>
                                setSaved((prev) => prev.filter((s) => s.id !== item.id))
                            }
                            showsave
                        />
                    )}
                    // Rendered when the user has no saved properties 
                    ListEmptyComponent={
                        <View className="flex-1 items-center justify-center py-24">
                            <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-4">
                                <Ionicons name="heart-outline" size={36} color="#EF4444" />
                            </View>
                            <Text className="text-gray-700 text-lg font-bold mb-1">
                                No saved properties
                            </Text>
                            <Text className="text-gray-400 text-sm text-center px-8">
                                Tap the heart icon on any property to save it here
                            </Text>
                            {/* Button to navigate to property search tab */}
                            <TouchableOpacity
                                onPress={() => router.push("/(root)/(tabs)/search")}
                                className="mt-6 bg-blue-600 px-6 py-3 rounded-2xl"
                            >
                                <Text className="text-white font-semibold">
                                    Browse Properties
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    )
}