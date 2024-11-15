import React from 'react'
import { Line,Doughnut } from 'react-chartjs-2'
import { getLast7Days } from '../../lib/Features';
const labels=getLast7Days()
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)
export const LineChart = () => {
  const data = {
    labels: labels,
    datasets: [
      {
        data:[1,23,56,10],
        label:"Revenue",
        fill:true,
        backgroundColor:"rgba(76,0,153,0.2)",
        borderColor:"rgba(76,0,153)"
      }
    ]
  }
  return (
    <Line data={data} />
  )
}

export const DougnutChart = ({value,labels}) => {
  const data={
    labels,
    datasets:[
     {
      data:value,
      label:"Total Charts vs Group Chart",
      backgroundColor:["#2a9d8f","#e9c46a"],
      borderColor:["white","white"],
      hoverBackgroundColor:["#264653","#ffb703"]
     }
    ]
  }
  return (
    <Doughnut data={data}/>
  )
}

