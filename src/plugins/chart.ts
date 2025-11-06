import {
  Chart,
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  DoughnutController,
  LineController,
  LineElement,
  PieController,
  PointElement,
  RadarController,
  RadialLinearScale,
  ScatterController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { HisonConfig } from '..'

Chart.register(
  // controllers
  BarController,
  LineController,
  RadarController,
  PieController,
  DoughnutController,
  BubbleController,
  ScatterController,
  // elements
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  // scales
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  // plugins
  Tooltip,
  Legend,
  Filler
)

export const configureChartDefaults = (hisonConfig: HisonConfig) => {
    const userDefaults = hisonConfig.component.chart
    if (userDefaults) {
        Object.assign(Chart.defaults, userDefaults)
    }
}
