import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import { Bar, Line } from "vue-chartjs";

ChartJS.register(BarElement);
ChartJS.register(CategoryScale);
ChartJS.register(Filler);
ChartJS.register(Legend);
ChartJS.register(LinearScale);
ChartJS.register(LineElement);
ChartJS.register(PointElement);
ChartJS.register(Title);
ChartJS.register(Tooltip);

export { Bar, Line };
