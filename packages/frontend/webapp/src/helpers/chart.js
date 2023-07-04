import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import {
    Bar as BarChart,
    Line as LineChart,
    Pie as PieChart,
} from "vue-chartjs";

ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip
);

export { BarChart, LineChart, PieChart };
