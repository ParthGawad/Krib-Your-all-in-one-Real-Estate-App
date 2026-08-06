import { NativeTabs, Icon, Label, VectorIcon } from 'expo-router/unstable-native-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
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
