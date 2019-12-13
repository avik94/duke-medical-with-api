<template>
  <v-container>
    <!-- <p>{{myProps}}</p> -->
    <!-- loader div -->
    <div class="text-center" v-if="loader">
      <v-progress-circular :size="50" :width="2" color="purple" indeterminate></v-progress-circular>
    </div>
    <!-- view div -->

    <!-- tab section start here -->
    <v-card color="basil"  v-if="view">

      <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
        <v-tab>
          Bar Plot
        </v-tab>
        <v-tab>
          Wave Form
        </v-tab>
        <v-tab>
          FFT
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" style="padding: 20px">
        <v-tab-item>
          <p v-if="noData">No Events Occured</p>
          <div v-if="showBar">
            <vue-plotly :data="linedata1.data" :layout="linedata1.layout" :options="linedata1.options" />
          </div>
        </v-tab-item>
        <v-tab-item>
          <!-- sine wave -->
            <v-row>
              <v-col cols="4">
                <v-select v-model="eventTime" :items="dateDropDown" label="Event Time"></v-select>
                
              </v-col>
              <v-col cols="4">
                <v-select v-model="statSineEvent" :items="statEventDropdown" label="Stats"></v-select>
              </v-col>
              <v-col cols="4" style="padding-top:30px">
                <v-btn color="primary lighten-2" dark @click="submitEventForSine(eventTime,statEvent)">Submit</v-btn>
              </v-col>
            </v-row>
            <!-- event sine plot -->
            <v-row v-if="eventPlot">
              <div class="text-center" v-if="eventLoader">
                <v-progress-circular :size="50" :width="2" color="purple" indeterminate></v-progress-circular>
              </div>
              <v-col cols="12" class="text-center">
                <vue-plotly :data="linedataSine.data" :layout="linedataSine.layout" :options="linedataSine.options" />
              </v-col>
            </v-row>
            <!-- event sine plot end -->
          <!-- end -->
        </v-tab-item>
        <v-tab-item>
          <!-- fft wave -->
            <v-row>
              <v-col cols="4">
                <v-select v-model="eventTime" :items="dateDropDown" label="Event Time"></v-select>
              </v-col>
              <v-col cols="4">
                <v-select v-model="statFftEvent" :items="statFFTDropdown" label="Stats"></v-select>
              </v-col>
              <v-col cols="4" style="padding-top:30px">
                <v-btn color="primary lighten-2" dark @click="submitFFT()">Submit</v-btn>
              </v-col>
            </v-row>
          <!-- end -->
        </v-tab-item>
      </v-tabs-items>

    </v-card>

    <!-- tab section end here -->

    <!-- <v-tab-item>
        
    </v-tab-item>-->
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
//@ts-ignore
import VuePlotly from "@statnett/vue-plotly";
import axios from "axios";
import { Component, Prop, Watch } from "vue-property-decorator";
@Component({
  components: {
    VuePlotly
  }
})
export default class EventTrap extends Vue {
  // @ts-ignore
  @Prop() myProps;

  @Watch("myProps")
  async myPropsChanged(val: string, oldVal: string) {
    this.eventPlot = false;

    console.log(this.myProps);
    this.loader = true;
    this.view = false;
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
        "Start time": apiStartTime.toString(),
        "End time": apiEndTime.toString(),
        "Event trap time": "",
        "FFT instant": "",
        "Time format": this.myProps.timeZone
      };
      // console.log(data);
      let responseData = await axios.post(
        "http://52.142.17.219:5446/api/analytics/trap_data/123-567-8910",
        data
      );
      // @ts-ignore
      console.log(responseData.data);
      if (responseData.data["Event Trap"] === "No event has occured") {
        this.dateDropDown = [];
        this.noData = true;
        this.showBar = false;
      } else {
        // this.dateDropDown = responseData.data["Event Trap"]["Event Time"];
        let xValue:any =[];
        let yValue:any =[];
        // this.linedata1.data[0].x = responseData.data["Event Trap"]["Bar Plot"]["Value"]
        for( let item of responseData.data["Event Trap"]["Bar Plot"]["Value"]){
          xValue.push(item[0]);
          yValue.push(item[1]);
        }
        this.linedata1.data[0].x = xValue;
        this.linedata1.data[0].y = yValue;
        this.dateDropDown = xValue;
        console.log(xValue, yValue);
        this.noData = false;
        this.showBar = true;
      }
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
        "Start time": apiStartTime.toString(),
        "End time": apiEndTime.toString(),
        "Event trap time": "",
        "FFT instant": "",
        "Time format": this.myProps.timeZone
      };
      let responseData = await axios.post(
        "http://52.142.17.219:5446/api/analytics/trap_data/123-567-8910",
        data
      );
      console.log(responseData.data);
      if (responseData.data["Event Trap"] === "No event has occured") {
        this.dateDropDown = [];
         this.noData = true;
         this.showBar = false;
      } else {
        this.dateDropDown = responseData.data["Event Trap"]["Event Time"];
        let xValue:any =[];
        let yValue:any =[];
        // this.linedata1.data[0].x = responseData.data["Event Trap"]["Bar Plot"]["Value"]
        for( let item of responseData.data["Event Trap"]["Bar Plot"]["Value"]){
          xValue.push(item[0]);
          yValue.push(item[1]);
        }
        this.linedata1.data[0].x = xValue;
        this.linedata1.data[0].y = yValue;
        this.dateDropDown = xValue;
        console.log(xValue, yValue);
        this.noData = false;
        this.showBar = true;

      }
    }
    this.loader = false;
    this.view = true;

  }
  // @ts-ignore
  @Prop() statData;

  tab = 0;
  eventTime = "";
  statSineEvent = "";
  statFftEvent = ""; 
  loader = true;
  noData = false;
  showBar = false;
  view = false;

  eventPlot = false;
  eventLoader = false;

  dateDropDown: any = [];
  statEventDropdown:any = ["Voltage_3ph", "Current_3ph", "Phase_1_Voltage_Current", "Phase_2_Voltage_Current", "Phase_3_Voltage_Current"];
  statFFTDropdown:any = [ "Phase-1 Voltage", "Phase-2 Voltage", "Phase-3 Voltage", "Phaes-1 Current","Phase-2 Current","Phase-3 Current"];

  async created() {
    this.eventPlot = false;

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
        "Start time": apiStartTime.toString(),
        "End time": apiEndTime.toString(),
        "Event trap time": "",
        "FFT instant": "",
        "Time format": this.myProps.timeZone
      };
      // console.log(data);
      let responseData = await axios.post(
        "http://52.142.17.219:5446/api/analytics/trap_data/123-567-8910",
        data
      );
      // @ts-ignore
      console.log(responseData.data);
      if (responseData.data["Event Trap"] === "No event has occured") {
        this.dateDropDown = [];
        this.noData = true;
        this.showBar = false;
      } else {
        // this.dateDropDown = responseData.data["Event Trap"]["Event Time"];
        let xValue:any =[];
        let yValue:any =[];
        // this.linedata1.data[0].x = responseData.data["Event Trap"]["Bar Plot"]["Value"]
        for( let item of responseData.data["Event Trap"]["Bar Plot"]["Value"]){
          xValue.push(item[0]);
          yValue.push(item[1]);
        }
        this.linedata1.data[0].x = xValue;
        this.linedata1.data[0].y = yValue;
        this.dateDropDown = xValue;
        console.log(xValue, yValue);
        this.noData = false;
        this.showBar = true;
      }
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
        "Start time": apiStartTime.toString(),
        "End time": apiEndTime.toString(),
        "Event trap time": "",
        "FFT instant": "",
        "Time format": this.myProps.timeZone
      };
      let responseData = await axios.post(
        "http://52.142.17.219:5446/api/analytics/trap_data/123-567-8910",
        data
      );
      console.log(responseData.data);
      if (responseData.data["Event Trap"] === "No event has occured") {
        this.dateDropDown = [];
         this.noData = true;
         this.showBar = false;
      } else {
        this.dateDropDown = responseData.data["Event Trap"]["Event Time"];
        let xValue:any =[];
        let yValue:any =[];
        // this.linedata1.data[0].x = responseData.data["Event Trap"]["Bar Plot"]["Value"]
        for( let item of responseData.data["Event Trap"]["Bar Plot"]["Value"]){
          xValue.push(item[0]);
          yValue.push(item[1]);
        }
        this.linedata1.data[0].x = xValue;
        this.linedata1.data[0].y = yValue;
        this.dateDropDown = xValue;
        console.log(xValue, yValue);
        this.noData = false;
        this.showBar = true;

      }
    }
    this.loader = false;
    this.view = true;
  }

  // line- plot
  linedata1 = {
    data: [
      {
        x: [],
        y: [],
        type: "bar",
        name: "vh1"
      }
    ],
    layout: {
      autosize: false,
      width: 850,
      height: 450,
      xaxis: {
        title: {
          text: "TimeStamp",
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

  // all submit api will trigger here
  async submitEventForSine() {
    this.linedataSine.data = [];
    console.log(this.eventTime, this.statSineEvent);
    this.eventPlot = true;
    // this.eventLoader = false
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
      let userDate = new Date(this.eventTime);
      let eventTime = Math.floor(userDate.getTime())
      let data = {
        "Machine name": this.myProps.machine,
        "Start time": apiStartTime.toString(),
        "End time": apiEndTime.toString(),
        "Event trap time": eventTime.toString(),
        "FFT instant": "",
        "Time format": this.myProps.timeZone,
        "sine_wave_stat": this.statSineEvent
      }
      console.log(data);
      let responseData = await axios.post('http://52.142.17.219:5446/api/analytics/trap_data/123-567-8910', data);
      console.log(responseData);
      // console.log(responseData.data["Event Trap"]["Sine_wave_data"].Value);
      // console.log(responseData.data["Event Trap"]["Sine_wave_data"].stat);
      // console.log(responseData.data["Event Trap"]["Sine_wave_data"].unit);
      let i = 0;
      for( let item of responseData.data["Event Trap"]["Sine_wave_data"].stat){
        console.log(item);
        let dataOfSine:any = {
          x: [],
          y: [],
          type: "line",
          // yaxis: 'y2',
          name: item
        }
        let p = 1;
        for(let itemEvent of responseData.data["Event Trap"]["Sine_wave_data"].Value){
          console.log(itemEvent)
          for(let item of itemEvent){
            console.log("item1"+itemEvent[p])
            // break;
            // console.log(p)
            dataOfSine.x.push(itemEvent[0]);
            dataOfSine.y.push(itemEvent[i+1]);
            p++;
          }
        }
        i++;
        this.linedataSine.data.push(JSON.parse(JSON.stringify(dataOfSine)));
      }
      // console.log(this.linedataSine.data);
      console.log(this.linedataSine)
      

    }else{
      console.log("work for custom time");
      const dateStart = new Date(
        this.myProps.fromDate + " " + this.myProps.fromHourMinutes
      );
      const apiStartTime = Math.floor(dateStart.getTime());
      const endStart = new Date(
        this.myProps.toDate + " " + this.myProps.toHourMinutes
      );
      const apiEndTime = Math.floor(endStart.getTime());
      let userDate = new Date(this.eventTime);
      let eventTime = Math.floor(userDate.getTime())
      let data = {
        "Machine name": this.myProps.machine,
        "Start time": apiStartTime.toString(),
        "End time": apiEndTime.toString(),
        "Event trap time": eventTime.toString(),
        "FFT instant": "",
        "Time format": this.myProps.timeZone,
        "sine_wave_stat": this.statSineEvent
      }
      console.log(data);
      let responseData = await axios.post('http://52.142.17.219:5446/api/analytics/trap_data/123-567-8910', data);
      console.log(responseData.data["Event Trap"]["Sine_wave_data"].value);
    }
    
      
  }


  submitEventForFft() {

  }
  linedataSine:any = {
    data: [
    ],
    layout: {
      autosize: false,
      width: 850,
      height: 450,
      yaxis: {title: 'yaxis title'},
      // yaxis2: {
      //   title: 'yaxis2 title',
      //   overlaying: 'y',
      //   side: 'right'
      // }
    },
    options: {}
  };
  // line-plot end
}
</script>
