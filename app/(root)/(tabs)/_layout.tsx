import { NativeTabs, Icon, Label, VectorIcon } from 'expo-router/unstable-native-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import useUserStore from '@/store/userStore';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';

function AndroidLayout() {
    const isAdmin = useUserStore((state) => state.isAdmin)

    return (
        <Tabs screenOptions={{ headerShown: false }}>
            {/* home screen */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='home' color={color} size={size} />
                    )
                }}
            />

            {/* search screen */}
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='search' color={color} size={size} />
                    )
                }}
            />

            {/* create screen */}
            <Tabs.Screen
                name="create"
                options={{
                    title: 'Create',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='create' color={color} size={size} />
                    )
                }}
            />

            {/* saved screen */}
            <Tabs.Screen
                name="save"
                options={{
                    title: 'Saved',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='heart' color={color} size={size} />
                    )
                }}
            />

            {/* profile screen */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='person' color={color} size={size} />
                    )
                }}
            />
        </Tabs>
    );
}

function IosLayout() {
    const isAdmin = useUserStore((state) => state.isAdmin)

    return (
        <NativeTabs>
            {/* Index/Home route */}
            <NativeTabs.Trigger name="index">
                <Icon sf="house.fill" androidSrc={<VectorIcon family={Ionicons} name="home" />} />
                <Label>Home</Label>
            </NativeTabs.Trigger>

            {/* Search route */}
            <NativeTabs.Trigger name="search">
                <Icon sf="magnifyingglass" androidSrc={<VectorIcon family={Ionicons} name="search" />} />
                <Label>Search</Label>
            </NativeTabs.Trigger>

            {/* Create Property route */}
            {isAdmin && (
                <NativeTabs.Trigger name="create">
                    <Icon sf="plus.circle.fill" androidSrc={<VectorIcon family={Ionicons} name="create" />} />
                    <Label>Create</Label>
                </NativeTabs.Trigger>
            )}


            {/* saved route */}
            <NativeTabs.Trigger name="save">
                <Icon sf="heart.fill" androidSrc={<VectorIcon family={Ionicons} name="heart" />} />
                <Label>Saved</Label>
            </NativeTabs.Trigger>

            {/* profile route */}
            <NativeTabs.Trigger name="profile">
                <Icon sf="person.fill" androidSrc={<VectorIcon family={Ionicons} name="person" />} />
                <Label>Profile</Label>
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}

export default function TabsLayout() {
    return Platform.OS === 'android' ? <AndroidLayout /> : <IosLayout />;
}
