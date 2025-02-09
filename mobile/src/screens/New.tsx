import { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

import { Feather } from '@expo/vector-icons'

import { BackButton } from "../components/BackButton";
import { CheckBox } from "../components/Checkbox";
import colors from "tailwindcss/colors";
import { api } from "../lib/axios";

const avaliableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-Feira', 'Quinta-feira', 'Sexta-feira', 'Sabado'];

export function New(){

    const [title, setTitle ] = useState(''); 
    const [ weekDays, setWeekDays ] = useState<number[]>([]);

    function handleToggleWeekDay(weekDayIndex: number){
        if (weekDays.includes(weekDayIndex)){
            setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex))
        } else {
            setWeekDays(prevState => [...prevState, weekDayIndex])
        }
    }

    async function handleCreateNewHabit(){
        try {

            if(!title.trim() || weekDays.length === 0){
               return Alert.alert('Novo Hábito', 'Informe o nome do Hábito e defina a recorrência')
            }

            await api.post('/habits',{ title, weekDays })

            setTitle('');
            setWeekDays([]);

            Alert.alert('Novo Hábito', 'Hábito criado com sucesso!')

        } catch (error) {
            console.log(error)
            Alert.alert('Eita', 'Não foi possível criar um novo hábito')
        }
    }

    return(
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <BackButton />

                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Criar Habito
                </Text>

                <Text className="mt-6 text-white font-semibold text-base">
                    Qual o seu comprometimento?
                </Text>

                <TextInput 
                    className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
                    placeholder="Exercicios, beber agua, etc..."
                    placeholderTextColor={colors.zinc[400]}
                    onChangeText={setTitle}
                    value={title}
                />

                <Text className="font-semibold mt-4 mb-3 text-white text-base ">
                    Qual a recorrência?
                </Text>
                
                {
                    avaliableWeekDays.map((weekDay, index) => (
                            <CheckBox 
                                onPress={() => handleToggleWeekDay(index)} 
                                checked={weekDays.includes(index)}
                                title={weekDay} 
                                key={weekDay} 
                            />
                        )
                    )
                }

                <TouchableOpacity
                    className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
                    activeOpacity={0.7}
                    onPress={handleCreateNewHabit}
                >
                    <Feather 
                        name="check"
                        size={20}
                        color={colors.white}
                    />
                    <Text className="font-semibold text-base text-white ml-2">
                        Confirmar
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    )
}