import { useAuth, useUser } from '@clerk/expo'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from "expo-image-picker"
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Alert, Image, Linking, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default async function Profile() {

    const { signOut } = useAuth()
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const [isUpdating, setIsUpdating] = useState(false)

    const handleUpdateImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

            if (!permissionResult.granted) {
                Alert.alert("Permission Required", "Please allow access to your photo library to update your profile picture")
                return
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: "images", allowsEditing: true, aspect: [1, 1], quality: 0.8, base64: true
            })

            if (result.canceled) return
            setIsUpdating(true)

            const base64Image = result.assets[0].base64
            const uri = result.assets[0].uri
            const filename = uri.split('/').pop() || 'profile.jpg'

            const match = /\.(\w+)$/.exec(filename)
            const mimeType = match ? `image/${match[1]}` : "image/jpeg"
            const dataUrl = `data:${mimeType};base64,${base64Image}`

            await user?.setProfileImage({ file: dataUrl })

            Alert.alert("Success", "Profile image updated successfully")

        } catch (error: any) {
            Alert.alert("Error", error.message)
        } finally {
            setIsUpdating(false)
        }
    }

    const logout = async () => {
        try {
            await signOut()
            router.replace('/signIn')
        } catch (error: any) {
            console.error("Error signing out : ", error.message)
        }
    }

    if (!user || !isLoaded) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#2563EB" />
            </SafeAreaView>
        )
    }

    return (
        // safe view
        <SafeAreaView className='flex-1 bg-white mb-10'>

            {/* parent view */}
            <View className="items-center py-8">

                {/* user image component */}
                <Image
                    source={{ uri: user.imageUrl }}
                    className='w-24 h-24 rounded-full mb-4'
                />

                {/* camera icon */}
                <TouchableOpacity className='absolute bottom-3 right-0 bg-blue-600 rounded-full p-3' disabled={isUpdating} onPress={handleUpdateImage}>
                    {isUpdating ? (
                        <ActivityIndicator size="small" color="#2563EB" />
                    ) : (
                        <Ionicons name='camera' size={20} color="#2563EB" />
                    )}
                </TouchableOpacity>


                <Text className='text-xl font-bold text-gray-800'>{user.firstName} {user.lastName}</Text>
                <Text className='text-base text-gray-500 mt-1'>{user.emailAddresses[0].emailAddress}</Text>

            </View>


            <View className='px-6 gap-2'>

                <MenuItem
                    icon="heart-outline"
                    label="saved properties"
                    onPress={() => router.push("/(root)/(tabs)/save")}
                />

                <MenuItem
                    icon="settings-outline"
                    label="settings"
                    onPress={() => Alert.alert("Settings Feature comming soon! ")}
                />

                <MenuItem
                    icon="notifications-outline"
                    label="notifications"
                    onPress={() => Alert.alert("Notification Feature comming soon!")}
                />

                <MenuItem
                    icon="help-circle-outline"
                    label="help & support"
                    onPress={() => Linking.openURL(
                        `mailto:${user.emailAddresses[0].emailAddress}
                        subject=Help%20%26%20Suppor%20-%20kribb%20App`
                    )}
                />

                <View className='px-6 mt-auto mb-8'>
                    {/* logout button */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        className='flex-row items-center justify-center gap-2 bg-red-50 py-4 rounded-2xl border border-red-100'
                        onPress={logout}
                    >
                        <Ionicons name='log-out-outline' size={20} color="#EF4444" />
                        <Text className='text-red-600 text-lg font-semibold'>logout</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    )
}

const MenuItem = ({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap, label: string, onPress: () => void }) => {
    return (
        <TouchableOpacity onPress={onPress} className='flex-row items-center gap-4 bg-gray-50 px-4 py-4 rounded-2xl'>
            <Ionicons name={icon} size={22} color='#6B7280' />
            <Text className='text-lg font-medium text-gray-800 flex-1'>{label}</Text>
            <Ionicons name='chevron-forward-outline' size={22} color='#6B7280' />

        </TouchableOpacity>
    )
}
