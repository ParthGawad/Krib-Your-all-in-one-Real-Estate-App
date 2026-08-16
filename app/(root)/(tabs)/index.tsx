import { View, Text, FlatList, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useUser } from '@clerk/expo'
import { useFocusEffect, useRouter } from 'expo-router'
import { Property } from '../../../types/interface'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import Ionicons from '@expo/vector-icons/Ionicons'
import Featured from '@/components/Featured'

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
    const fetchData = async () => {
        try {
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
        } catch (error) {
            Alert.alert("An Error occurred while fetching : ", error as string)
            console.log("Error : ", error)
        }
    }


    useFocusEffect(
        useCallback(() => {
            fetchData()
        }, [])
    )

    console.log(JSON.stringify(featured, null, 2), JSON.stringify(recommended, null, 2))

    return (
        <SafeAreaView>
            <FlatList
                data={featured}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View>
                        {/* Header */}
                        <View className='flex-row items-center justify-between px-5 pt-4 pb-5'>
                            {/* logo */}
                            <Image
                                source={require("../../../assets/images/kribb.png")}
                                className='w-[116px] h-[52px]'
                                resizeMode='contain'
                            />

                            <View className='items-end'>
                                <Text className='text-gray-900 text-lg font-bold'>Welcome, {user?.firstName ?? "user"}</Text>
                            </View>
                        </View>

                        {/* Search bar */}
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => router.push("/(root)/(tabs)/search")}
                            className='flex-row mt-5 mb-6 items-center bg-white rounded-2xl px-4 py-3 mx-5 border border-gray-200'
                        >
                            <Ionicons name='search-outline' size={20} color="#0F172A" />
                            <Text className='ml-3 text-gray-400 text-lg flex-1'>Search Properties, cities</Text>

                            {/* Category filter */}
                            <TouchableOpacity
                                onPress={() => router.push("/(root)/(tabs)/search?openFilter=true")}
                                className='w-8 h-8 bg-blue-200 rounded-xl items-center justify-center'
                            >
                                <Ionicons name="options-outline" size={20} color="white" />
                            </TouchableOpacity>

                        </TouchableOpacity>

                        {/* Featured listings */}
                        <View className='mb-6'>
                            <Text className='px-5 font-bold text-2xl text-gray-800'>Featured</Text>
                            {loading ? (
                                <ActivityIndicator
                                    size="small"
                                    className='py-10'
                                    color="#0F172A"
                                />
                            ) : (
                                <FlatList
                                    data={featured}
                                    keyExtractor={(item) => item.id}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item }) => <Featured property={item} />}
                                    horizontal
                                    contentContainerStyle={{ paddingHorizontal: 20, gap: 10, marginTop: 5 }}
                                />
                            )}
                        </View>

                        {/* Recommended listings */}
                        <Text className='px-5 font-bold text-2xl text-gray-800'>Recommended for you</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View className='px-5'>
                        <Text className='font-bold text-lg'>{item.title}</Text>
                    </View>
                )}
                ListEmptyComponent={
                    !loading ? (
                        <View className='flex items-center justify-center py-10'>
                            <Text className='text-gray-400'>No Properties found</Text>
                        </View>
                    ) : null
                }

            />
        </SafeAreaView>
    )
}