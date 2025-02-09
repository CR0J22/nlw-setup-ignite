import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

import { useRoute } from '@react-navigation/native'

import dayjs from "dayjs";

import { api } from "../lib/axios";

import { generateProgressPercentage } from "../utils/generate-progress-percentege";

import { ProgressBar } from "../components/ProgressBar";
import { BackButton } from "../components/BackButton";
import { CheckBox } from "../components/Checkbox";
import { Loading } from "../components/Loading";
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";

interface Params {
    date: string;
}

interface DayInfoProps {
    completedHabits: string[];
    possibleHabits: {
        id: string;
        title: string;
    }[] 
}

export function Habit(){
    
    const [ loading, setLoading ] = useState(true)
    const [ dayInfo, setDayInfo ] = useState< DayInfoProps | null >(null)
    const [completedHabits, setCompletedHabits] = useState<string[]>([])

    const route = useRoute()
    const { date } = route.params as Params;

    const parseDate = dayjs(date);

    const isDateInPast = parseDate.endOf('day').isBefore( new Date)

    const dayOfWeek = parseDate.format('dddd')
    const dayAndMouth = parseDate.format('DD/MM')

    const habitsProgress = dayInfo?.possibleHabits.length ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length) : 0

    async function fechHabits() {
        try {
            setLoading(true)

            const response = await api.get('/day', { params: { date } })
            
            setDayInfo(response.data)
            setCompletedHabits(response.data.completedHabits)
            
        } catch (error) {
            console.log(error)
            Alert.alert('Truco','Deu pau na busca, verifique a conexão e tente novamente' )
        } finally {
            setLoading(false)

        }
    }

    async function handleToggleHabit(habitId: string) {
        try {
            await api.patch(`/habits/${habitId}/toggle`)
            if(completedHabits.includes(habitId)){
                setCompletedHabits(prevState => prevState.filter( habit => habit !== habitId))
            } else {
                setCompletedHabits(prevState => [...prevState, habitId])
            }
        } catch(error){
            console.log(error)
            Alert.alert('Opa','Não conseguimos atualizar o habito')
        }
    }

    useEffect(() => {
        fechHabits()
    }, [])

    if(loading) {
        return (
            <Loading />
        )
    }

    /* console.log(date,dayAndMouth,dayOfWeek) */

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

                <ProgressBar progress={habitsProgress}/>

                <View className={clsx("mt-6",{
                    ["opacity-50"] : isDateInPast
                })}>
                    { dayInfo?.possibleHabits ?
                        dayInfo?.possibleHabits.map(habit => (

                            <CheckBox
                                key={habit.id}
                                title={habit.title}
                                checked={completedHabits.includes(habit.id)}
                                disabled={isDateInPast}
                                onPress={() => handleToggleHabit(habit.id)}
                            />

                        ))

                        : <HabitsEmpty />

                    }
                    
                </View>

                {
                    isDateInPast && (
                        <Text className="text-white mt-10 text-center">
                            Você não pode editar habitos de uma data passada.
                        </Text>
                    )
                }

            </ScrollView>
        </View>
    )
}