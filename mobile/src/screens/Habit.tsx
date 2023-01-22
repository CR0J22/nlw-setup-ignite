import { ScrollView, Text, View } from "react-native";
import { useRoute } from '@react-navigation/native'

import dayjs from "dayjs";

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox } from "../components/Checkbox";

interface Params {
    date: string;
}

export function Habit(){
    
    const route = useRoute()
    const { date } = route.params as Params;

    const parseDate = dayjs(date);

    const dayOfWeek = parseDate.format('dddd')
    const dayAndMouth = parseDate.format('DD/MM')

    console.log(date,dayAndMouth,dayOfWeek)

    return(
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100}}
            >
                <BackButton />

                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>

                <Text className="text-white font-extrabold text-3xl">
                    {dayAndMouth}
                </Text>

                <ProgressBar progress={90}/>

                <View className="mt-6">
                    <CheckBox 
                        title="Beber 2L de agua"
                        checked={true}
                    />
                    <CheckBox 
                        title="Caminhar"
                        checked={false}
                    />
                </View>

            </ScrollView>
        </View>
    )
}