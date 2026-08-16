import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Property } from '@/types/interface'

export default function Featured({ property }: { property: Property }) {
    return (
        <TouchableOpacity className='w-72 mr-2 rounded-2xl overflow-hidden bg-white'>
            <Image source={{ uri: property.images[0] }} className='w-full h-44' resizeMode='cover' />
        </TouchableOpacity>
    )
}