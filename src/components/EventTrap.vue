<template>
  <v-container>
      <p>{{myProps}}</p>
    <!-- loader div -->
    <div class="text-center" v-if="loader">
      <v-progress-circular :size="50" :width="2" color="purple" indeterminate></v-progress-circular>
    </div>
    <!-- view div -->
    <v-row v-if="view">
      <v-col cols="4"></v-col>
      <v-col cols="4">
        <v-select
              v-model="eventTime"
              :items="dateDropDown"
              label="Event Time">
        </v-select>
      </v-col> 
      <v-col cols="4" style="padding-top:30px">
        <v-btn color="primary lighten-2" dark @click="submitEvent()">Submit</v-btn>
      </v-col>    
    </v-row>
    <!-- <v-row> -->
      <!-- <v-col cols = "12"> -->
        <!-- line-plot -->
        <!-- <v-card flat color="basil">
          <vue-plotly
            :data="linedata.data"
            :layout="linedata.layout"
            :options="linedata.options"
          />
        </v-card> -->
        <!-- line-plot end -->
      <!-- </v-col> -->
    <!-- </v-row> -->
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
//@ts-ignore
import VuePlotly from "@statnett/vue-plotly";
import axios from "axios";
import { Component, Prop, Watch  } from "vue-property-decorator";
@Component({
   components: {
    VuePlotly
  }
})
export default class EventTrap extends Vue {
  // @ts-ignore
  @Prop() myProps;

  @Watch('myProps')
  myPropsChanged(val: string, oldVal: string) {
    console.log(this.myProps);
  }
  // @ts-ignore
  @Prop() statData;

  eventTime = "";
  loader = true;
  view = false;
  dateDropDown:any = [];
  
  async created(){ 
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
        "Machine name": "MDB",
        "Start time": apiStartTime.toString(),
        "End time": apiEndTime.toString(),
        "Event trap time": "",
        "FFT instant": "",
        "Time format": "IST"
      };
      // console.log(data);
      let responseData = await axios.post('http://52.142.17.219:5446/api/analytics/trap_data/123-567-8910', data);
      // @ts-ignore
      console.log(responseData.data);
      if(responseData.data["Event Trap"] === "No event has occured"){
        this.dateDropDown = [];       
      }else{
        this.dateDropDown = responseData.data["Event Trap"]["Event Time"]
      }
      
    }else{
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
        "Machine name": "MDB",
        "Start time": apiStartTime.toString(),
        "End time": apiEndTime.toString(),
        "Event trap time": "",
        "FFT instant": "",
        "Time format": "IST"
      };
      let responseData = await axios.post('http://52.142.17.219:5446/api/analytics/trap_data/123-567-8910', data);
      console.log(responseData.data);
      if(responseData.data["Event Trap"] === "No event has occured"){
        this.dateDropDown = [];       
      }else{
        this.dateDropDown = responseData.data["Event Trap"]["Event Time"]
      }
    }
    this.loader = false;
    this.view = true;
  }

  
  

  // line- plot
  linedata = {
    data: [
      {
        x: [50, 100, 150, 200, 250],
        y: [-20, 80, 40, 65, 13, 75, 15],
        type: "scatter",
        name: "vh1"
      },
      {
        x: [50, 100, 150, 200, 250],
        y: [40, 70, 50, 30, 90, 15, 60],
        type: "scatter",
        name: "vh2"
      },
      {
        x: [50, 100, 150, 200, 250],
        y: [0, 30, 65, 25, 70, 50, 95],
        type: "scatter",
        name: "vh3"
      }
    ],
    layout: {},
    options: {}
  };
  // line-plot end  

  // all submit api will trigger here
  submitEvent(){

  }
}
</script>
