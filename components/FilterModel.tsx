import { PropertyType, useFilterStore } from '@/types/filterStore'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useState } from 'react'
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'

export default function FilterModel({visible, onClose} : {visible : boolean, onClose : () => void}) {
  const {
    type,
    bedrooms,
    minPrice,
    maxPrice,
    setType,
    setBedrooms,
    setMinPrice,
    setMaxPrice,
    resetFilters
  } = useFilterStore()
  
  // reset filters
  const handleReset = () => {
    resetFilters()
    setLocalMax("")
    setLocalMin("")
    onClose()
  }

  // local state for min and max price inputs
  const [localMin, setLocalMin] = useState(minPrice ? String(minPrice) : "")
  const [localMax, setLocalMax] = useState(maxPrice ? String(maxPrice) : "") 
  // count of active filters
  const activeCount = [type, bedrooms, minPrice, maxPrice].filter((v) => v !== null).length
  
  // apply filters
  const handleApply = () => {
    setMinPrice(localMin ? Number(localMin) : null)
    setMaxPrice(localMax ? Number(localMax) : null)
    onClose()
  }


  // filter data 
  const TYPES: { label: string; value: PropertyType }[] = [
    { label: "All", value: null },
    { label: "Apartment", value: "apartment" },
    { label: "House", value: "house" },
    { label: "Villa", value: "villa" },
    { label: "Studio", value: "studio" },
  ];

  const BEDS = [
    { label: "Any", value: null },
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4+", value: 4 },
  ];

  const PRICE_PRESETS = [
    { label: "Under ₹50L", min: null, max: 5000000 },
    { label: "₹50L – ₹1Cr", min: 5000000, max: 10000000 },
    { label: "₹1Cr – ₹2Cr", min: 10000000, max: 20000000 },
    { label: "Above ₹2Cr", min: 20000000, max: null },
  ];

  // filter chip style
  const chip = (active : boolean) => {
    return `px-5 py-3 rounded-full border ${
      active ? "bg-blue-500 border-blue-500" : "bg-white border-gray-300"
    }`;
  }

  const chipText = (active : boolean) => {
    return `text-lg font-semibold ${
      active ? "text-white" : "text-gray-600"
    }`
  };

  return (
    <Modal visible={visible} animationType='slide' presentationStyle='pageSheet' onRequestClose={onClose} >
        <View className='flex-1 bg-gray-50 rounded-xl'>

            <View className='flex-1 px-5 pt-6 pb-4 bg-white border-b border-gray-100'>

                <View className='flex-row items-center justify-between '>
                  {/* close button */}
                    <TouchableOpacity className='p-1' onPress={onClose}>
                        <Ionicons name="close" size={22} color="#374151"/>
                    </TouchableOpacity>

                    <Text className='text-2xl font-bold text-gray-900'>Filters</Text>

                    {/* Reset button, to reset filters */}
                    <TouchableOpacity onPress={handleReset}>
                        <Text className='text-blue-400 font-semibold text-sm'>Reset</Text>
                    </TouchableOpacity>

                </View>
                
                {/* scrollview containing filter options */}
                <ScrollView className='flex-1' contentContainerStyle={{padding : 20, paddingBottom : 40}} showsVerticalScrollIndicator={false}>
                 
                  {/* Property Filters */}
                  <Text className='text-xl font-bold text-gray-800 mt-10 mb-6'>Property type</Text>   
                  {/*Filter Chip*/}
                  <View className='flex-row flex-wrap gap-2 mb-6'>
                    {TYPES.map((item) => (
                      <TouchableOpacity
                        key={String(item.value)}
                        className={chip(type === item.value)}
                        onPress={() => setType(item.value)}
                      >
                        <Text className={chipText(type === item.value)}>{item.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                
                  {/* Bedrooms Filter */}
                  <Text className='text-xl font-bold text-gray-800 mt-10 mb-6'>Bedrooms</Text>   
                  {/*Filter Chip*/}
                  <View className='flex-row flex-wrap gap-2 mb-6'>
                    {BEDS.map((item) => (
                      <TouchableOpacity
                        key={String(item.value)}
                        className={`flex-1 items-center py-3 rounded-2xl border ${chip(bedrooms === item.value)}`}
                        onPress={() => setBedrooms(item.value)}
                      >
                        <Text className={`text-lg font-bold ${chipText(bedrooms === item.value)}`}>{item.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Price Filter */}
                  <Text className='text-xl font-bold text-gray-800 mt-10 mb-6'>Price</Text>   
                  {/*Filter Chip*/}
                  <View className='flex-row gap-3 mb-3'>
                    {[
                      {
                        label : "Min Price",
                        value : localMin,
                        onChange : setLocalMin,
                        placeholder : "0"
                      },{
                        label : "Max Price",
                        value : localMax,
                        onChange : setLocalMax,
                        placeholder : "Any"
                      }
                    ].map(({label, value, onChange, placeholder}) => (
                      <View className='flex-1' key={label}>
                        <Text className=''>

                        </Text>
                      </View>
                    ))}
                  </View>

                </ScrollView>

            </View> 

        </View>

    </Modal>
  )
}