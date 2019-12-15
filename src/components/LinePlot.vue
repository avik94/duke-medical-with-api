<template>
  <v-container>
    <!-- loader div -->
    <div class="text-center" v-if="loader">
      <v-progress-circular :size="50" :width="2" color="purple" indeterminate></v-progress-circular>
    </div>
    <div v-if="noData">
      <p>No Data Found</p>
    </div>
    <!-- view div -->
    <div v-if="view">
      <!-- <p>{{myProps}}</p> -->
      <vue-plotly :data="linedata.data" :layout="linedata.layout" :options="linedata.options" />
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
//@ts-ignore
import VuePlotly from "@statnett/vue-plotly";
import { Component, Prop, Watch } from "vue-property-decorator";
@Component({
  components: {
    VuePlotly
  }
})
export default class LinePlot extends Vue {
  // @ts-ignore
  @Prop() myProps;

  @Watch("myProps", { deep: true })
  async myPropsChanged(val: any, oldVal: string) {
    this.view = false;
    this.noData = false;
    this.loader = true;
    if (this.myProps.quickTime) {
      console.log("work for quick time");
      let startTime: any;
      let getUnitStr = this.myProps.quickTime.split("");
      let unit = getUnitStr[getUnitStr.length - 1];
      getUnitStr.pop();
      let time = getUnitStr.join("");
      if (unit === "m") {
        startTime = new Date(Date.now() - 60000 * parseInt(time));
      }
      if (unit === "h") {
        startTime = new Date(Date.now() - 1000 * 3600 * parseInt(time));
      }
      if (unit === "d") {
        startTime = new Date(Date.now() - 1000 * 3600 * 24 * parseInt(time));
      }

      const apiStartTime = Math.floor(startTime.getTime());
      // console.log("Start Time :"+apiStartTime);
      const date = new Date();
      const apiEndTime = Math.floor(date.getTime());
      // console.log("End Time : "+apiEndTime);
      let data = {
        "Machine name": this.myProps.machine,
        "Stat name": this.myProps.stat,
        "Start time": apiStartTime.toString(),
        "End time": apiEndTime.toString(),
        "Time format": this.myProps.timeZone
      };
      console.log(data);
      // @ts-ignore
      let responseData = await axios.post(
        "http://52.142.17.219:5446/api/analytics/normal_data/123-567-8910",
        data
      );
      // console.log(responseData.data["Line Plot"]);
      // work for no data found
      if (responseData.data["Line Plot"] === "No Data Found") {
        this.noData = true;
        this.loader = false;
        this.view = false;
      } else {
        this.linedata.data[0].name = responseData.data["Line PLot"].Stat[0];
        this.linedata.data[1].name = responseData.data["Line PLot"].Stat[1];
        this.linedata.data[2].name = responseData.data["Line PLot"].Stat[2];
        
        this.linedata.layout.title.text = responseData.data["Line PLot"].Title[0];
        this.linedata.layout.yaxis.title = responseData.data["Line PLot"].Unit[0];
        // console.log(responseData.data["Line PLot"].Value)
        let xAxis: any = [];
        let firstYaxis: any = [];
        let seccondYaxis: any = [];
        let thirdYaxis: any = [];
        for (let item of responseData.data["Line PLot"].Value) {
          xAxis.push(item[0]);
          firstYaxis.push(item[1]);
          seccondYaxis.push(item[2]);
          thirdYaxis.push(item[3]);
        }
        this.linedata.data[0].x = xAxis;
        this.linedata.data[1].x = xAxis;
        this.linedata.data[2].x = xAxis;
        this.linedata.data[0].y = firstYaxis;
        this.linedata.data[1].y = seccondYaxis;
        this.linedata.data[2].y = thirdYaxis;
        this.view = true;
        this.loader = false;
        this.noData = false;
      }

      // no data found end
    } else {
      console.log("work for customize time");
      const dateStart = new Date(
        this.myProps.fromDate + " " + this.myProps.fromHourMinutes
      );
      const apiStartTime = Math.floor(dateStart.getTime());
      const endStart = new Date(
        this.myProps.toDate + " " + this.myProps.toHourMinutes
      );
      const apiEndTime = Math.floor(endStart.getTime());
      let data = {
        "Machine name": this.myProps.machine,
        "Stat name": this.myProps.stat,
        "Start time": apiStartTime.toString(),
        "End time": apiEndTime.toString(),
        "Time format": this.myProps.timeZone
      };
      console.log(data);
      // @ts-ignore
      let responseData = await axios.post(
        "http://52.142.17.219:5446/api/analytics/normal_data/123-567-8910",
        data
      );
      // work for no data found
      if (responseData.data["Line Plot"] === "No Data Found") {
        this.noData = true;
        this.loader = false;
        this.view = false;
      } else {
        // console.log(responseData.data["Line PLot"].Stat[0]);
        this.linedata.data[0].name = responseData.data["Line PLot"].Stat[0];
        this.linedata.data[1].name = responseData.data["Line PLot"].Stat[1];
        this.linedata.data[2].name = responseData.data["Line PLot"].Stat[2];
        
        this.linedata.layout.title.text = responseData.data["Line PLot"].Title[0];
        this.linedata.layout.yaxis.title = responseData.data["Line PLot"].Unit[0];
        // console.log(responseData.data["Line PLot"].Value)
        let xAxis: any = [];
        let firstYaxis: any = [];
        let seccondYaxis: any = [];
        let thirdYaxis: any = [];
        for (let item of responseData.data["Line PLot"].Value) {
          xAxis.push(item[0]);
          firstYaxis.push(item[1]);
          seccondYaxis.push(item[2]);
          thirdYaxis.push(item[3]);
        }
        this.linedata.data[0].x = xAxis;
        this.linedata.data[1].x = xAxis;
        this.linedata.data[2].x = xAxis;
        this.linedata.data[0].y = firstYaxis;
        this.linedata.data[1].y = seccondYaxis;
        this.linedata.data[2].y = thirdYaxis;
        this.view = true;
        this.loader = false;
        this.noData = false;
      }

      //wok for no data end
    }
  }

  linedata = {
    data: [
      {
        x: [],
        y: [],
        type: "line",
        name: ""
      },
      {
        x: [],
        y: [],
        type: "line",
        name: ""
      },
      {
        x: [],
        y: [],
        type: "line",
        name: ""
      },
      // {
      //   x: [],
      //   y: [],
      //   type: "line",
      //   name: "th"
      // }
    ],
    layout: {
      autosize: false,
      width: 850,
      height: 450,
      title: {
        text: "Plot Title",
        font: {
          family: "Courier New, monospace",
          size: 17,
          align: 'center'
        },
        xref: "paper",
        x: 0.05
      },
      yaxis: {
        title: {
          text: "Y Axis",
          font: {
            family: "Courier New, monospace",
            size: 17,
            color: "#7f7f7f"
          }
        }
      }
    },
    options: {}
  };
  // line-plot end

  view = false;
  noData = false;
  loader = true;

  async created() {
    if (this.myProps.quickTime) {
      console.log("work for quick time");
      let startTime: any;
      let getUnitStr = this.myProps.quickTime.split("");
      let unit = getUnitStr[getUnitStr.length - 1];
      getUnitStr.pop();
      let time = getUnitStr.join("");
      if (unit === "m") {
        startTime = new Date(Date.now() - 60000 * parseInt(time));
      }
      if (unit === "h") {
        startTime = new Date(Date.now() - 1000 * 3600 * parseInt(time));
      }
      if (unit === "d") {
        startTime = new Date(Date.now() - 1000 * 3600 * 24 * parseInt(time));
      }

      const apiStartTime = Math.floor(startTime.getTime());
      // console.log("Start Time :"+apiStartTime);
      const date = new Date();
      const apiEndTime = Math.floor(date.getTime());
      // console.log("End Time : "+apiEndTime);
      let data = {
        "Machine name": this.myProps.machine,
        "Stat name": this.myProps.stat,
        "Start time": apiStartTime.toString(),
        "End time": apiEndTime.toString(),
        "Time format": this.myProps.timeZone
      };
      console.log(data);
      // @ts-ignore
      let responseData = await axios.post(
        "http://52.142.17.219:5446/api/analytics/normal_data/123-567-8910",
        data
      );
      // console.log(responseData.data["Line Plot"]);
      // work for no data found
      if (responseData.data["Line Plot"] === "No Data Found") {
        this.noData = true;
        this.loader = false;
        this.view = false;
      } else {
        this.linedata.data[0].name = responseData.data["Line PLot"].Stat[0];
        this.linedata.data[1].name = responseData.data["Line PLot"].Stat[1];
        this.linedata.data[2].name = responseData.data["Line PLot"].Stat[2];
        this.linedata.layout.title.text = responseData.data["Line PLot"].Title[0];
        this.linedata.layout.yaxis.title = responseData.data["Line PLot"].Unit[0];
        // console.log(responseData.data["Line PLot"].Value)
        let xAxis: any = [];
        let firstYaxis: any = [];
        let seccondYaxis: any = [];
        let thirdYaxis: any = [];
        // let fourthYaxis:any = [];
        for (let item of responseData.data["Line PLot"].Value) {
          xAxis.push(item[0]);
          firstYaxis.push(item[1]);
          seccondYaxis.push(item[2]);
          thirdYaxis.push(item[3]);
          // fourthYaxis.push(this.myProps.threshold)
        }
        this.linedata.data[0].x = xAxis;
        this.linedata.data[1].x = xAxis;
        this.linedata.data[2].x = xAxis;
        // this.linedata.data[3].x = xAxis;
        this.linedata.data[0].y = firstYaxis;
        this.linedata.data[1].y = seccondYaxis;
        this.linedata.data[2].y = thirdYaxis;
        // this.linedata.data[3].y = fourthYaxis;
        this.view = true;
        this.loader = false;
        this.noData = false;
      }

      // no data found end
    } else {
      console.log("work for customize time");
      const dateStart = new Date(
        this.myProps.fromDate + " " + this.myProps.fromHourMinutes
      );
      const apiStartTime = Math.floor(dateStart.getTime());
      const endStart = new Date(
        this.myProps.toDate + " " + this.myProps.toHourMinutes
      );
      const apiEndTime = Math.floor(endStart.getTime());
      let data = {
        "Machine name": this.myProps.machine,
        "Stat name": this.myProps.stat,
        "Start time": apiStartTime.toString(),
        "End time": apiEndTime.toString(),
        "Time format": this.myProps.timeZone
      };
      console.log(data);
      // @ts-ignore
      let responseData = await axios.post(
        "http://52.142.17.219:5446/api/analytics/normal_data/123-567-8910",
        data
      );
      // work for no data found
      if (responseData.data["Line Plot"] === "No Data Found") {
        this.noData = true;
        this.loader = false;
        this.view = false;
      } else {
        // console.log(responseData.data["Line PLot"].Stat[0]);
        this.linedata.data[0].name = responseData.data["Line PLot"].Stat[0];
        this.linedata.data[1].name = responseData.data["Line PLot"].Stat[1];
        this.linedata.data[2].name = responseData.data["Line PLot"].Stat[2];
        
        this.linedata.layout.title.text = responseData.data["Line PLot"].Title[0];
        this.linedata.layout.yaxis.title = responseData.data["Line PLot"].Unit[0];
        // console.log(responseData.data["Line PLot"].Value)
        let xAxis: any = [];
        let firstYaxis: any = [];
        let seccondYaxis: any = [];
        let thirdYaxis: any = [];
        for (let item of responseData.data["Line PLot"].Value) {
          xAxis.push(item[0]);
          firstYaxis.push(item[1]);
          seccondYaxis.push(item[2]);
          thirdYaxis.push(item[3]);
        }
        this.linedata.data[0].x = xAxis;
        this.linedata.data[1].x = xAxis;
        this.linedata.data[2].x = xAxis;
        this.linedata.data[0].y = firstYaxis;
        this.linedata.data[1].y = seccondYaxis;
        this.linedata.data[2].y = thirdYaxis;
        this.view = true;
        this.loader = false;
        this.noData = false;
      }

      //wok for no data end
    }
  }
}
</script>