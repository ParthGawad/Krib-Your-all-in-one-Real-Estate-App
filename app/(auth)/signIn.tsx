import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native'
import React, { useState } from 'react'
import { useSignIn } from '@clerk/expo'
import { Link } from 'expo-router'

export default function SignIn() {
    const { signIn, errors, fetchStatus } = useSignIn();
    // user states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [isVerify, setIsVerify] = useState(false);

    // loading state
    const isLoading = fetchStatus === "fetching";


    // sign in function
    const onSignInPressed = async () => {
        // awaits the signIn response
        const { error } = await signIn.password({
            emailAddress: email,
            password,
        });
        // if error persist return else contiune
        if (error) {
            Alert.alert("Error", error.message)
            console.log(JSON.stringify(error, null, 2))
            return
        }

        if (signIn.status === "complete") {
            await signIn.finalize()
        } else if (signIn?.status === "needs_second_factor") {
            await signIn.mfa.sendPhoneCode()
        } else if (signIn.status === "needs_client_trust") {
            const emailCodeFactor = signIn.supportedSecondFactors.find(
                (factor) => factor.strategy === "email_code"
            )

            if (emailCodeFactor) {
                await signIn.mfa.sendEmailCode()
                setIsVerify(true)
            }
        } else {
            console.error("SignIn attempt failed : ", signIn)
        }
    }


    // verify code function
    const onVerifyPress = async () => {
        await signIn.mfa.verifyEmailCode({
            code,
        })

        if (signIn.status === "complete") {
            await signIn.finalize()
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

                {/* sign In background & form container */}
                <View className='bg-gray-100 border border-black rounded-xl p-[18px]'>

                    {/* sign in title header */}
                    <Text className='text-3xl font-bold text-black mt-6'>{isVerify ? 'Verify Code' : 'Welcome Back, Sign in to Continue'}</Text>

                    {/* Email Code logic if verification is required */}
                    {isVerify ? (

                        // verification code input field
                        <View className='gap-3 mt-4'>
                            {/* code input field */}
                            <TextInput placeholder='Enter code sent to your email' className="flex-1 border border-gray-300 rounded-lg px-4 py-3 mt-4" keyboardType="number-pad" value={code} onChangeText={setCode} />

                            {/* verify button*/}
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
                                onPress={() => signIn.mfa.sendEmailCode()}
                            >
                                <Text className='text-lg text-blue-500 underline'>Resend new verification code to your email? </Text>
                            </TouchableOpacity>

                        </View>

                    ) : (
                        // input fields container
                        <View className='gap-3 mt-4'>

                            {/*  email input */}
                            <TextInput placeholder='Email' className='border border-gray-300 rounded-lg px-4 py-3 mt-4' value={email} onChangeText={setEmail} keyboardType='email-address' autoCapitalize='none' />
                            {errors.fields.identifier && (
                                <Text className='text-red-400 ml-3'>{errors.fields.identifier.message}</Text>
                            )}

                            {/* password field */}
                            <TextInput placeholder='Password' className='border border-gray-300 rounded-lg px-4 py-3 mt-4' value={password} onChangeText={setPassword} secureTextEntry={true} />
                            {errors.fields.password && (
                                <Text className='text-red-400 ml-3'>{errors.fields.password.message}</Text>
                            )}


                            {/* sign in button */}
                            <TouchableOpacity
                                activeOpacity={0.7}
                                className="bg-black rounded-lg justify-center items-center mt-10 py-3"
                                onPress={onSignInPressed}
                                disabled={isLoading}
                            >
                                {isLoading ? <ActivityIndicator className='text-white text-lg font-semibold' /> : <Text className='text-white text-lg font-semibold'>Sign In</Text>}
                            </TouchableOpacity>

                        </View>
                    )}
                </View>

                {/* sign Up link section */}
                <View className="flex-row justify-center items-center mt-6 gap-2">

                    <Text className='text-xl text-black font-semibold'>{"Don't have an account ?"}</Text>
                    <Link href="/signUp" asChild>
                        <TouchableOpacity>
                            <Text className='text-blue-500 text-lg font-semibold'>Sign Up</Text>
                        </TouchableOpacity>
                    </Link>

                </View>

                {/* captcha container */}
                <View nativeID='clerk-captcha' />
            </View>
        </ScrollView>
    )
}