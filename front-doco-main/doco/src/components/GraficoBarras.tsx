import React from 'react';
import { Chart as ChartJS,CategoryScale, LinearScale,BarElement, Title, Tooltip,Legend,} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import theme from "../config/theme";
// import * as faker from 'faker';

ChartJS.register(  CategoryScale, LinearScale, BarElement,  Title, Tooltip, Legend);



export function GraficoBarras({... props}) {

    const { labels , value} = props

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: { display: false},
        },

    };


    const data = {
        labels,
        datasets: [
            {
                data: value,
                backgroundColor: theme.palette.secondary.main,
                hoverBackgroundColor: theme.palette.secondary.dark,
                maxBarThickness: 60,

            },
        ],
    };

    return <Bar height={'100%'}  options={options} data={data} />

}
