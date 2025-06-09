"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
    {
        name: "Jan",
        total: Math.floor(Math.random() * 100) + 50,
    },
    {
        name: "Feb",
        total: Math.floor(Math.random() * 100) + 50,
    },
    {
        name: "Mar",
        total: Math.floor(Math.random() * 100) + 50,
    },
    {
        name: "Apr",
        total: Math.floor(Math.random() * 100) + 50,
    },
    {
        name: "May",
        total: Math.floor(Math.random() * 100) + 50,
    },
    {
        name: "Jun",
        total: Math.floor(Math.random() * 100) + 50,
    },
]

export default function CustomerAnalytics() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            formatter={(value: any) => [`${value}`, "Users"]}
                            cursor={{ fill: "transparent" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="currentColor"
                            strokeWidth={2}
                            className="stroke-primary"
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
} 