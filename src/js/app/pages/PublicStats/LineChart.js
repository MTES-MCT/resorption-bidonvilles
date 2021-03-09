import { Line, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
    extends: Line,
    mixins: [reactiveProp],
    props: ["options", "chartData"],
    mounted() {
        console.log("mounted", this.chartData);
        // this.chartData is created in the mixin.
        // If you want to pass options please create a local options object
        this.renderChart(this.chartData, this.options);
    },
    watch: {
        chartData() {
            console.log("chartData", this.chartData);
            this.$data._chart.update();
        }
    }
};
