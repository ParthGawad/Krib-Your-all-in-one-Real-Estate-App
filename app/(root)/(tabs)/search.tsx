import FilterModel from '@/components/FilterModel';
import { useFilterStore } from '@/types/filterStore';
import { Property } from '@/types/interface';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function search() {

    const [results,setResults] = useState<Property[]>([])
    const [loading,setLoading] = useState(false)
    const [showFilters,setShowFilters] = useState(false)
    // grab the openFilters param from the URL to determine if the filter modal should be open on page load
    const {openFilters} = useLocalSearchParams<{openFilters? : string}>();

    // useEffect to check if the openFilters param is set to true, if so, set showFilters to true
    useEffect(()=> {
        if(openFilters === "true") 
            setShowFilters(true)      
    },[openFilters])

    // types
    const {
        search,
        type,
        bedrooms,
        minPrice,
        maxPrice,
        setSearch,
        setType,
        setBedrooms,
        setMinPrice,
        setMaxPrice
    } = useFilterStore()

    // const activeFilterCount = 2
    const activeFilterCount =[
        type !== null,
        bedrooms !== null,
        minPrice !== null,
        maxPrice !== null
    ].filter(Boolean).length;

    return (
         <SafeAreaView className='flex-1'>
            

            <View className='px-5 pt-4 pb-3'>
                <Text className='text-3xl font-bold mb-4'>
                    Find Property
                </Text>
            </View>

            {/*Search bar*/}
            <TouchableOpacity
                activeOpacity={0.7}
                className='flex-row mt-5 mb-6 items-center bg-white rounded-2xl px-4 py-3 mx-5 border border-gray-200'
            >
                {/* Search icon */}
                <Ionicons name='search-outline' size={20} color="#0F172A" />
                {/* Search input */}
                <TextInput
                    className='flex-1 py-3 text-gray-800'
                    placeholder='Search City, Property, etc'
                    placeholderTextColor="#94A3B8"
                    value={search}
                    onChangeText={setSearch}
                    autoCapitalize='none'
                />

                {/* Close button, appears when search is not empty */}
                {search.length > 0 && (
                    <TouchableOpacity onPress={()=>setSearch("")}>
                        <Ionicons name="close-circle" size={20} color="black" />
                    </TouchableOpacity>
                )}

                 {/* Category filter */}
                <TouchableOpacity
                    className={`w-12 h-12 ${activeFilterCount > 0 ? 'bg-blue-600' : 'bg-white'} rounded-xl items-center justify-center shadow`}
                    onPress={()=> setShowFilters(true)}
                >
                    {/* Filter icon */}
                    <Ionicons name="options-outline" size={24} color={activeFilterCount > 0 ? "#fff" : "#374151"} />
                </TouchableOpacity>
                
                {/* Filter count */}
                {activeFilterCount > 0 && (
                    <View className='absolute top-1 right-3 w-5 h-5 bg-red-500 rounded-full items-center justify-center'>
                        <Text className='text-white text-xs font-bold'>{activeFilterCount}</Text>
                    </View>
                )}

            </TouchableOpacity>

            {/* Filter Chips */}

            {/* Results */}

            {/* Filter Model */}
            <FilterModel 
                visible={showFilters}
                onClose={()=>setShowFilters(false)}
            />
         </SafeAreaView>
    )
}