import { PropertyType, useFilterStore } from '@/types/filterStore'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useState } from 'react'
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function FilterModel({ visible, onClose }: { visible: boolean, onClose: () => void }) {
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
  const chip = (active: boolean) => {
    return `px-5 py-3 rounded-full border ${active ? "bg-blue-500 border-blue-500" : "bg-white border-gray-300"
      }`;
  }

  const chipText = (active: boolean) => {
    return `text-lg font-semibold ${active ? "text-white" : "text-gray-600"
      }`
  };

  return (
    <Modal visible={visible} animationType='slide' presentationStyle='formSheet' onRequestClose={onClose} >
      <View className='flex-1 bg-gray-50 rounded-xl'>

        <View className='flex-1 px-5 pt-6 pb-4 bg-white border-b border-gray-100'>

          <View className='flex-row items-center justify-between '>
            {/* close button */}
            <TouchableOpacity className='p-1' onPress={onClose}>
              <Ionicons name="close" size={22} color="#374151" />
            </TouchableOpacity>

            <Text className='text-2xl font-bold text-gray-900'>Filters</Text>

            {/* Reset button, to reset filters */}
            <TouchableOpacity onPress={handleReset}>
              <Text className='text-blue-400 font-semibold text-sm'>Reset</Text>
            </TouchableOpacity>

          </View>

          {/* scrollview containing filter options */}
          <ScrollView className='flex-1' contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

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
            {/*Min Price & Max Price componenets */}
            <View className='flex-row gap-3 mb-3'>
              {[
                // min label data
                {
                  label: "Min Price",
                  value: localMin,
                  onChange: setLocalMin,
                  placeholder: "0"
                }, { // max label data
                  label: "Max Price",
                  value: localMax,
                  onChange: setLocalMax,
                  placeholder: "Any"
                } // mapping them into structured u.i
              ].map(({ label, value, onChange, placeholder }) => (
                // parent view
                <View className='flex-1' key={label}>
                  {/* text label */}
                  <Text className='mb-4'>{label}</Text>

                  {/* child view */}
                  <View className='flex-row bg-white rounded-2xl px-3 border border-gray-200 shadow-md'>
                    {/* text label for price */}
                    <Text className='flex-1 py-3 text-gray-400 mr-1'>$</Text>
                    {/* text input to input a price */}
                    <TextInput
                      className='flex-1 py-3 text-gray-800'
                      placeholder={placeholder}
                      value={value}
                      onChangeText={onChange}
                      keyboardType='numeric'
                    />
                  </View>

                </View>
              ))}

            </View>

            {/* widgets for automatic price range selection */}
            <View className='flex-row flex-wrap gap-2 mb-6'>

              {/* mapping price preset data to u.i components */}
              {PRICE_PRESETS.map((p) => {

                // set the min & max price to global var
                const active = minPrice === p.min && maxPrice === p.max;

                // return the structured u.i
                return (
                  <TouchableOpacity
                    key={p.label}
                    onPress={() => {
                      setLocalMax(p.max ? String(p.max) : "")
                      setLocalMin(p.min ? String(p.min) : "")
                      setMinPrice(p.min)
                      setMaxPrice(p.max)
                    }}
                    className={`px-4 py-2 rounded-full border ${active ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
                      }`}
                  >
                    <Text className={`text-lg font-medium ${active ? "text-blue-500" : "text-gray-500"}`}>
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                )
              })}

            </View>

          </ScrollView>

          {/*Apply Filter button*/}
          <View className='px-5 pb-8 pt-4 border-t bg-white border-gray-100 '>
            <TouchableOpacity
              className='bg-blue-600 rounded-2xl py-4 items-center'
              onPress={handleApply}
            >
              <Text className='text-white font-bold text-2xl'>
                Apply Filter {activeCount > 0 ? `(${activeCount})` : ""}
              </Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>

    </Modal>
  )
}