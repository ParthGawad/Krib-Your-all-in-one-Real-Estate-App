import { View, Text, FlatList, Alert } from 'react-native'
import React, { useState } from 'react'
import { useUser } from '@clerk/expo'
import { useRouter } from 'expo-router'
import { Property } from '../../../types/interface'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'

// Home page
export default function index() {
    // user state
    const { user } = useUser()

    // router state
    const router = useRouter()

    // data states
    const [featured, setFeatured] = useState<Property[]>([])
    const [recommended, setRecommended] = useState<Property[]>([])
    const [loading, setLoading] = useState(true)

    // fetch data
    try {
        const fetchData = async () => {
            setLoading(true)

            const { data: featuredData } = await supabase
                .from("properties")
                .select("*")
                .eq("is_featured", false)
                .order("created_at", { ascending: false })

            const { data: recommendedData } = await supabase
                .from("properties")
                .select("*")
                .eq("is_featured", false)
                .order("created_at", { ascending: false })

            setFeatured(featuredData ?? [])
            setRecommended(recommendedData ?? [])
            setLoading(false)
        }
        fetchData()
    } catch (error) {
        Alert.alert("An Error occurred while fetching : ", error as string)
        console.log("Error : ", error)
    }
    return (
        <SafeAreaView>
            <FlatList
                data={[]}
                renderItem={({ item }) => (
                    <Text></Text>
                )}
            />
        </SafeAreaView>
    )
}