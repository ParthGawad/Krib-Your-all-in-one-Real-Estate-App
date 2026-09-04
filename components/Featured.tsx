import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Property } from '@/types/interface'
import { useRouter } from 'expo-router'
import { BlurView } from 'expo-blur'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function Featured({ property }: { property: Property }) {
    const router = useRouter()
    return (
        <TouchableOpacity
            className='w-72 mr-2 rounded-2xl overflow-hidden bg-white shadow-gray-50 shadow-sm elevation-lg'
            onPress={() => router.push(`/property/${property.id}`)}
        >
            <Image source={{ uri: property.images[0] }} className='w-full h-44' resizeMode='cover' />

            {/* property type */}
            <View className='absolute top-3 left-3 bg-white px-3 py-1 rounded-full'>
                <Text className='text-gray-800 font-bold text-lg'>{property.type}</Text>
            </View>

            {/* Sold type */}
            {!property.is_sold && (
                <View className='absolute top-3 right-3 bg-red-500 px-3 py-1 rounded-full'>
                    <Text className='text-white font-bold text-lg'>Sold</Text>
                </View>
            )}

            {/* property title */}
            <View
                className='absolute bottom-0 left-0 right-0 px-4 py-3'
            >
                {/* property name */}
                <Text className='text-xl font-bold text-white' numberOfLines={1}>
                    {property.title}, {formatPrice(property.price)}
                </Text>

                {/* property address with icon*/}
                <View className='flex-row items-center'>
                    <Ionicons name="location-outline" size={13} color="white" />
                    <Text className='text-lg font-bold text-gray-200' numberOfLines={1}>
                        {property.address}, {property.city}
                    </Text>
                </View>
            </View>

        </TouchableOpacity>
    )
}

const formatPrice = (price: number) => {
    if (price >= 10000000) {
        const cr = (price / 10000000).toFixed(1).replace(/\.0$/, "")
        return `₹${cr}Cr`
    } else if (price >= 100000) {
        const lkh = (price / 100000).toFixed(1).replace(/\.0$/, "")
        return `₹${lkh}Lakh`
    } else {
        return `₹${price}`
    }
}