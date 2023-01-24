import { useEffect, useState } from "react";

import { View, Text, ScrollView, Alert  } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { api } from "../lib/axios";
import { generateRangeDatesFromYearStart } from '../utils/generate-range-between-dates';

import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import dayjs from "dayjs";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] 

const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSumaryDatesSize = 18 * 5;
const amountOfDaysToFill = minimumSumaryDatesSize - datesFromYearStart.length ;

type SummaryProps = Array<{
    id: string;
    date: string;
    amount: number;
    completed: number;
}>

export function Home() {

    const [loading, setLoading ] = useState(true)
    const [ summary, setSummary ] = useState<SummaryProps | null>(null)

    const { navigate } = useNavigation();

    async function fechData(){
        try {
            setLoading(true)
            const response = await api.get('/summary')
            setSummary(response.data)
            console.log(response.data)
            
        } catch (error) {

            Alert.alert('Uepa...','Algo de errado não está certo!')
            console.log(error);

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fechData()
    }, [])

    if(loading){
        return(
            <Loading />
        );
    }

    return (
    <View className="flex-1 bg-background px-8 pt-16">
        
        <Header />
            <View className="flex-row mt-6 mb-2">
                {
                    weekDays.map((weekDay, i) => (
                        <Text 
                            key={`${weekDay}-${i}`}
                            className="text-zinc-400 text-xl font-bold text-center mx-1"
                            style={{width: DAY_SIZE}}
                        >
                            {weekDay}
                        </Text>
                    ))
                }
            </View>
        
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100}}
        >
            { summary &&
                <View className="flex-row flex-wrap ">

                    {
                        datesFromYearStart.map(date => {
                            
                            const dayWhithHabits = summary.find(day => {
                                return dayjs(date).isSame(day.date, 'day')
                            })
                            
                            return (
                                <HabitDay 
                                date={date}
                                key={date.toISOString()}
                                amountOfHabits={dayWhithHabits?.amount}
                                amountCompleted={dayWhithHabits?.completed}
                                onPress={() => navigate('habit', {date : date.toISOString()})}
                            />
                        )})
                    }
                    {
                    amountOfDaysToFill > 0 && Array
                    .from({ length: amountOfDaysToFill })
                    .map((_, i) => (
                        <View
                            key={i}
                            className="bg-zin-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                            style={{ width: DAY_SIZE, height: DAY_SIZE }}
                        />
                    ))
                }
                </View>
            }

        </ScrollView>
        
    </View>

    )
}