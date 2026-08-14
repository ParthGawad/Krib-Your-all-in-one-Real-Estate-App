import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import { useAuth, useSignUp } from '@clerk/expo'
import { Link } from 'expo-router';

export default function SignUp() {
    // signup states
    const { signUp, errors, fetchStatus } = useSignUp();
    const { isSignedIn } = useAuth()
    // user states
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [isVerify, setIsVerify] = useState(false);

    // loading state
    const isLoading = fetchStatus === "fetching";

    if (signUp.status === "complete" && isSignedIn) {
        return null
    }

    // sign up function
    const onSignUpPressed = async () => {
        // awaits the signUp response
        const { error } = await signUp.password({
            emailAddress: email,
            password,
            firstName,
            lastName
        });
        // if error persist return else contiune
        if (error) {
            Alert.alert("Error", error.message)
            console.log(JSON.stringify(error, null, 2))
            return
        } else // sends an code to the respective entered email
            await signUp.verifications.sendEmailCode()

        if (signUp.status === "missing_requirements" && signUp.unverifiedFields.includes('email_address') && signUp.missingFields.length === 0) {
            Alert.alert("Success", "Verification code sent to your email")
            setIsVerify(true)
        }
    }


    // verify code function
    const onVerifyPress = async () => {
        await signUp.verifications.verifyEmailCode({
            code,
        })

        if (signUp.status === "complete") {
            await signUp.finalize()
        }
    }


    return (

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className='bg-white' keyboardShouldPersistTaps="handled">

            <View className='top-12 px-6 py-12'>
                {/* header section, contains logo & tagLine of the app */}
                <View className='justify-center items-center flex-col mb-20'>

                    <Image source={require('../../assets/images/kribb.png')} className='w-32 h-32' resizeMode='contain' />
                    <Text className='text-2xl font-bold text-black '>Find your dream home today</Text>

                </View>

                {/* sign up background & form container */}
                <View className='bg-gray-100 border border-black rounded-xl p-[18px]'>

                    <Text className='text-3xl font-bold text-black mt-6'>{isVerify ? 'Verify Code' : 'Create Account'}</Text>

                    {/* Email Code logic if verification is required */}
                    {isVerify ? (

                        // verification code input field
                        <View className='gap-3 mt-4'>
                            {/* code input field */}
                            <TextInput placeholder='Enter code sent to your email' className="flex-1 border border-gray-300 rounded-lg px-4 py-3 mt-4" keyboardType="number-pad" value={code} onChangeText={setCode} />
                            {/* verify button */}
                            <TouchableOpacity
                                activeOpacity={0.7}
                                className="bg-black rounded-lg justify-center items-center mt-5 py-3"
                                onPress={onVerifyPress}
                                disabled={isLoading}
                            >
                                {isLoading ? <ActivityIndicator className='text-white text-lg font-semibold' /> : <Text className='text-white text-lg font-semibold'>Verify</Text>}
                            </TouchableOpacity>

                            {/* Resend code */}
                            <TouchableOpacity
                                activeOpacity={0.7}
                                className="mt-2 p-4"
                                onPress={() => signUp.verifications.sendEmailCode()}
                            >
                                <Text className='text-lg text-blue-500 underline'>Resend new verification code to your email? </Text>
                            </TouchableOpacity>

                        </View>

                    ) : (
                        // input fields container
                        <View className='gap-3 mt-4'>

                            {/* first name & last name container */}
                            <View className='flex-row justify-between gap-3 items-center w-full'>

                                <TextInput placeholder='First Name' className='flex-1 border border-gray-300 rounded-lg px-4 py-3 mt-4' autoCapitalize='words' value={firstName} onChangeText={setFirstName} />
                                <TextInput placeholder='Last Name' className='flex-1 border border-gray-300 rounded-lg px-4 py-3 mt-4' autoCapitalize='words' value={lastName} onChangeText={setLastName} />

                            </View>

                            {/*  email input */}
                            <TextInput placeholder='Email' className='border border-gray-300 rounded-lg px-4 py-3 mt-4' value={email} onChangeText={setEmail} keyboardType='email-address' autoCapitalize='none' />
                            {errors.fields.emailAddress && (
                                <Text className='text-red-400 ml-3'>{errors.fields.emailAddress.message}</Text>
                            )}

                            {/* password field */}
                            <TextInput placeholder='Password' className='border border-gray-300 rounded-lg px-4 py-3 mt-4' value={password} onChangeText={setPassword} secureTextEntry={true} />
                            {errors.fields.password && (
                                <Text className='text-red-400 ml-3'>{errors.fields.password.message}</Text>
                            )}


                            {/* sign up button */}
                            <TouchableOpacity
                                activeOpacity={0.7}
                                className="bg-black rounded-lg justify-center items-center mt-10 py-3"
                                onPress={onSignUpPressed}
                                disabled={isLoading}
                            >
                                {isLoading ? <ActivityIndicator className='text-white text-lg font-semibold' /> : <Text className='text-white text-lg font-semibold'>Sign Up</Text>}
                            </TouchableOpacity>

                        </View>
                    )}
                </View>

                {/* sign in link section */}
                <View className="flex-row justify-center items-center mt-6 gap-2">

                    <Text className='text-xl text-black font-semibold'>Already have an account ?</Text>
                    <Link href="/signIn" asChild>
                        <TouchableOpacity>
                            <Text className='text-blue-500 text-lg font-semibold'>Sign In</Text>
                        </TouchableOpacity>
                    </Link>

                </View>

                {/* captcha container */}
                <View nativeID='clerk-captcha' />
            </View>
        </ScrollView>
    )
} 