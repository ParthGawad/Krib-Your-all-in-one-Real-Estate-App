import FilterModel from '@/components/FilterModel';
import Propertycard from '@/components/Propertycard';
import { supabase } from '@/lib/supabase';
import { useFilterStore } from '@/types/filterStore';
import { Property } from '@/types/interface';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function search() {

    const [results, setResults] = useState<Property[]>([])
    const [loading, setLoading] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    // grab the openFilters param from the URL to determine if the filter modal should be open on page load
    const { openFilters } = useLocalSearchParams<{ openFilters?: string }>();

    // useEffect to check if the openFilters param is set to true, if so, set showFilters to true
    useEffect(() => {
        if (openFilters === "true")
            setShowFilters(true)
    }, [openFilters])

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
    const activeFilterCount = [
        type !== null,
        bedrooms !== null,
        minPrice !== null,
        maxPrice !== null
    ].filter(Boolean).length;


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

    // supabase fetch function to fetch data based on the seach & filters
    const fetchResults = async() => {

        setLoading(true) // set loading to true while the data fetches 
        let query = supabase.from("properties").select("*"); // main query that selects all the data from properties section

        // checks if the user has searched for anything, runs a special query that returns return like the search query
        if (search) 
            query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%`);

        // if filters are selected by user, it modifies & runs the query accordingly
        if (type) 
            query = query.eq("type",type)

        if (bedrooms) 
            query = query.eq("bedrooms", bedrooms)
        
        if (minPrice) 
            query = query.gte("price", minPrice)

        if (maxPrice)
            query = query.lte("price", maxPrice)


        // after all the corresponding types & properties from the fetched data is ordered ascending descending order of the respective data creation time
        const {data} = await query.order("created_at",{
            ascending : false,
        });

        // sets the data 
        setResults(data ?? []);
        // sets loading to false
        setLoading(false);
    }

    // useEffect whenever the user changes the filter, the changes will dynamically get affected in real time
    useEffect(()=>{
        fetchResults()
    },[search, type, bedrooms, minPrice, maxPrice])


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
                    <TouchableOpacity onPress={() => setSearch("")}>
                        <Ionicons name="close-circle" size={20} color="black" />
                    </TouchableOpacity>
                )}

                {/* Category filter */}
                <TouchableOpacity
                    className={`w-12 h-12 ${activeFilterCount > 0 ? 'bg-blue-600' : 'bg-white'} rounded-xl items-center justify-center shadow`}
                    onPress={() => setShowFilters(true)}
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
            {activeFilterCount > 0 && (
                <View className='flex-row flex-wrap gap-2 mt-3'>

                    {/* Property Type Filter Chip */}
                    {type && (
                        <View className='flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1'>
                            {/* Text */}
                            <Text className='text-blue-700 text-xs font-semibold capitalize'>
                                {type}
                            </Text>

                            {/* Close micro-button */}
                            <TouchableOpacity onPress={()=> setType(null)}> 
                                <Ionicons name='close' size={12} color="#1d4ed8"/>
                            </TouchableOpacity>
                        </View>
                    )}

                    {bedrooms !== null && (
                        <View className='flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1'>
                            <Text className='text-blue-700 text-xs font-semibold'>
                                {bedrooms === 4 ? "4+ beds" : `${bedrooms} bed${bedrooms > 1 ? "s" : ""}`}
                            </Text>

                            <TouchableOpacity onPress={()=>setType(null)}>
                                <Ionicons name="close" size={12} color="#1d4ed8"/>
                            </TouchableOpacity>
                        </View>
                    )}

                    {(minPrice !== null || maxPrice !== null) && (
                        <View className='flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1'>
                            <Text className='text-blue-700 text-xs font-semibold'>
                                {minPrice && maxPrice 
                                    ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                                    : minPrice 
                                        ? `From ${formatPrice(minPrice)}`
                                        : `Up to ${formatPrice(maxPrice!)}`
                                }
                            </Text>

                            <TouchableOpacity onPress={()=>{
                                setMinPrice(null);
                                setMaxPrice(null);
                            }}>
                                <Ionicons name="close" size={12} color="#1d4ed8"/>
                            </TouchableOpacity>
                        </View>
                    )}

                </View>
            )}

            {/* Results */}
            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding : 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <Text className='text-lg text-gray-400 mb-4'>
                        {loading ? "searching..." : `${results.length} properties found`}
                    </Text>
                }
                renderItem={({ item }) => (
                        <Propertycard property={item} />
                )}
                ListEmptyComponent={
                    !loading ? (
                        <View className='flex items-center justify-center py-10'>
                            <Text className='text-gray-400'>No Properties found, try a different search or adjust filters</Text>
                        </View>
                    ) : (
                        <ActivityIndicator 
                            size="large"
                            color="2563eb"
                            className='py-20'
                        />
                    )
                }

            />
            {/* Filter Model */}
            <FilterModel
                visible={showFilters}
                onClose={() => setShowFilters(false)}
            />
        </SafeAreaView>
    )
}

