import { useSavedProperty } from '@/hooks/useSavedProperty'
import { Property } from '@/types/interface'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { Image, Text, TouchableOpacity, View } from 'react-native'

export default function Propertycard({ property, onUnsave, showsave }: { property: Property, onUnsave?: () => void, showsave?: boolean }) {
    const router = useRouter()
    // const [isSaved, setIsSaved] = useState(false) // save icon state

    const { isSaved, saveLoading, toggleSave } = useSavedProperty(property.id, onUnsave)
    return (
        <TouchableOpacity
            className='flex-row w-full mr-2 rounded-2xl overflow-hidden bg-white shadow-gray-50 shadow-lg elevation-lg mt-5'
            onPress={() => router.push(`/property/${property.id}`)}
        >

            <Image source={{ uri: property.images[0] }} className='w-1/3 h-44 rounded-2xl' resizeMode='cover' />

            <View className='flex-col px-4 w-2/3'>

                {/* property title */}
                <View className='flex-row items-center justify-between mt-8'>

                    {/* property name */}
                    <Text className='text-xl font-bold text-black' numberOfLines={1}>
                        {property.title}
                    </Text>

                    {/* save icon */}
                    <TouchableOpacity onPress={toggleSave} disabled={saveLoading} className='w-10 items-center'>
                        <Ionicons name={isSaved ? "heart" : "heart-outline"} size={17} color={isSaved ? "red" : "gray"} />
                    </TouchableOpacity>

                </View>

                {/* property address with icon*/}
                <View className='flex-row items-center'>

                    <Ionicons name="location-outline" size={13} color="black" />
                    <Text className='text-lg font-medium text-gray-600' numberOfLines={1}>
                        {property.city}
                    </Text>

                </View>

                {/* price */}
                <View className='flex-1 py-2 justify-between flex-row items-center'>

                    <Text className='text-xl font-bold text-blue-600'>
                        {formatPrice(property.price)}
                    </Text>

                    {/* bed and area sqft */}
                    <View className='flex-row items-center gap-3'>

                        <View className='flex-row items-center gap-1'>

                            <Ionicons name="bed-outline" size={14} color="gray" />
                            <Text className='text-md font-semibold text-gray-600'>{property.bedrooms}</Text>

                        </View>

                        <View className='flex-row items-center gap-1'>

                            <Ionicons name="expand-outline" size={14} color="gray" />
                            <Text className='text-md font-semibold text-gray-600'>{property.area_sqft}</Text>

                        </View>

                    </View>

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