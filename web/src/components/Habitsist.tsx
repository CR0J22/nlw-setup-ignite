import { useEffect, useState } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';
import { api } from '../lib/axios';
import dayjs from 'dayjs';

interface HabitsListProps {
    date: Date;
    onCompletedChanged: (completed: number) => void
}

interface HabitsInfo {

    possibleHabits: {
        id: string;
        title: string;
        created_at: string;
    }[],
    completedHabits: string[]

}

export function HabitsList({ date, onCompletedChanged }: HabitsListProps){

    const [habitsInfo, setHabitisInfo] = useState<HabitsInfo>();

    useEffect(() => {
        api.get('day', {
            params: {
                date: date.toISOString(),
            }
        }).then(response => {

            setHabitisInfo(response.data)
            
        })
    }, [])

    async function handleToggleHabit(habitId: string){
        
        await api.patch(`/habits/${habitId}/toggle`)
        
        const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId);

        let completedHabits: string[] =[]

        if (isHabitAlreadyCompleted) {

            completedHabits = habitsInfo!.completedHabits.filter( id => id !== habitId )
     

        } else {

            completedHabits = [...habitsInfo!.completedHabits, habitId]

        }

        setHabitisInfo({
            possibleHabits: habitsInfo!.possibleHabits,
            completedHabits,
        })

        onCompletedChanged(completedHabits.length)

    }

    const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())

    return (


        <div className='mt-6 flex flex-col gap-3'>

            {
                
                habitsInfo?.possibleHabits.map(habit => {
                    return(
                        <Checkbox.Root 
                            key={habit.id}
                            onCheckedChange={() => handleToggleHabit(habit.id)}
                            disabled={isDateInPast}
                            defaultChecked={habitsInfo.completedHabits.includes(habit.id)}
                            className='flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed'
                        >

                            <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background'>
                                <Checkbox.Indicator>
                                    <Check size={20} className='text-white' />
                                </Checkbox.Indicator>
                            </div>

                        
                            <span className='font-semibold text-xl  text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                                {habit.title}
                            </span>

                        </Checkbox.Root>

                    )
                })
            }


        </div>

    )
}