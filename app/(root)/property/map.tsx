import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function map() {
    const { latitude, longitude, title, address } = useLocalSearchParams<{ latitude: string, longitude: string, title: string, address: string }>();
    const router = useRouter();

    const lat = parseFloat(latitude)
    const log = parseFloat(longitude)
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${log - 0.001
        }%2C${lat - 0.001}%2C${log + 0.001}%2C${lat + 0.001
        }&layer=mapnik&marker=${lat}%2C${log}`;

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-100'>

                <TouchableOpacity className='w-9 h-9 items-center justify-center rounded-full bg-gray-100' onPress={() => router.back()}>
                    <Ionicons name='arrow-back' size={20} color="#111827" />
                </TouchableOpacity>

                <View className='flex-1 mx-3'>
                    <Text className='text-gray-900 font-semibold text-sm' numberOfLines={1}>{title}</Text>
                    <Text className='text-xs text-gray-400'>{address}</Text>
                </View>

                <TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps?q=${lat},${log}`)} className='flex-row items-center gap-1 bg-blue-50 px-3 py-2 rounded-full'>
                    <Ionicons name="navigate-outline" />
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    )
}