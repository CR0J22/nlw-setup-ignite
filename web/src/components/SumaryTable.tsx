import { useEffect, useState } from "react"
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning-dates"

import { HabitDay } from "./HabitDay"
import { api } from "../lib/axios"
import dayjs from "dayjs"

const weekDays = [ 'D' , 'S', 'T', 'Q', 'Q', 'S', 'S' ]

const sumaryDates = generateDatesFromYearBeginning()
const minimumSumaryDatesSize = 18 * 7
const amountOfDaysToFill =  minimumSumaryDatesSize - sumaryDates.length

type Summary = {
    id: string;
    date: string;
    amount: number;
    completed: number;
}[]

export function SumaryTable(){

    const [summary, setSummary] = useState<Summary>([],)

    useEffect(() => {
        api.get('summary').then(response => {
           setSummary(response.data)
        })
    }, [])


    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">

                {
                    weekDays.map((weekDay, i) => {
                        return(
                            <div key={`${weekDay}-${i}`} className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center">
                                {weekDay}
                            </div>
                        )
                    })
                }
            </div>
            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {
                   summary.length > 0 && sumaryDates.map(date => {
                        const dayInSumary = summary.find(day => {
                            return dayjs(date).isSame(day.date, 'day')
                        })
                        return (
                            <HabitDay 
                                key={date.toString()} 
                                date={date}
                                amount={dayInSumary?.amount} 
                                defaultCompleted={dayInSumary?.completed} 
                            />
                        )
                    })
                }
                {
                    amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => {
                        return (
                            <div 
                                key={i} 
                                className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
                            />
                        )
                    })
                }
                   
                

            </div>
        </div>

    )
}