import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from '@expo/vector-icons'

import { useNavigation } from "@react-navigation/native";

import colors from 'tailwindcss/colors'

import Logo from '../assets/logo.svg'

export function Header() {

    const { navigate } = useNavigation()

    return (
        <View className="w-full flex-row items-center justify-between">
            <Logo />

            < TouchableOpacity
                className="flex-row h-11 px-4 border border-violet-500 rounded-lg items-center"
                activeOpacity={0.7}
                onPress={() => navigate('new')}
            >
                < Feather 
                    name="plus"
                    color={colors.violet[500]}
                    size={25}
                />
                <Text className="text-white ml-3 font-semibold text-base ">
                    Novo
                </Text>
            </TouchableOpacity>

        </View>
    )
}