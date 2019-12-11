<template>
    <v-container>
      <!-- loader div -->
      <div class="text-center"  v-if="loader">
        <v-progress-circular
          :size="50"
          :width="2"
          color="purple"
          indeterminate
          
        ></v-progress-circular>
      </div>
      <!-- view div -->
      <div v-if="view">
        <p>{{myProps}}</p>
        <vue-plotly
            :data="linedata.data"
            :layout="linedata.layout"
            :options="linedata.options"
        />
      </div>
      <!-- no data div -->
      <!-- <div class="text-center" v-if="noData">
        <p><b>Sorry! No Data Available!</b></p>
      </div> -->
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from 'axios';
//@ts-ignore
import VuePlotly from "@statnett/vue-plotly";
import { Component, Prop, Watch } from "vue-property-decorator";
@Component({
   components: {
    VuePlotly
  }
})
export default class MaxLine extends Vue {
    // @ts-ignore
  @Prop() myProps;

  @Watch('myProps',{deep:true})
  async myPropsChanged(val: any, oldVal: string) {
    // console.log(val.quickTime);
    // // @ts-ignore
    // this.linedata.data[0].x = [1,2,3,4,5];
    // // @ts-ignore
    // this.linedata.data[0].y = [50,30,35,20,10];
    
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
      }
    ],
    layout: {},
    options: {}
  };
  // line-plot end
  view = false;
  // noData = false;
  loader = true;

  async created(){
    
    if(this.myProps.quickTime){
      console.log("work for quick time")
      let startTime:any;
      let getUnitStr = this.myProps.quickTime.split("");
      let unit = getUnitStr[getUnitStr.length - 1];
      getUnitStr.pop();
      let time = getUnitStr.join("");
      if(unit === "m"){
        startTime = new Date(Date.now() - 60000 * parseInt(time));
      }
      if(unit === "h"){
        startTime = new Date(Date.now() - 1000 * 3600 * parseInt(time));
      }
      if(unit === "d"){
        startTime = new Date(Date.now() - 1000 * 3600 * 24 * parseInt(time));
      }

      const apiStartTime = Math.floor(startTime.getTime())
      // console.log("Start Time :"+apiStartTime);
      const date = new Date();
      const apiEndTime = Math.floor(date.getTime());
      // console.log("End Time : "+apiEndTime);
      let data ={
        "Machine name": "MDB",
        "Stat name": this.myProps.stat,
        "Start time": apiStartTime.toString(),
        "End time": apiEndTime.toString(),
        "Time format": "IST"
      }
      console.log(data);
      // @ts-ignore
      let responseData = await axios.post('http://52.142.17.219:5446/api/analytics/normal_data/123-567-8910', data);
    //   console.log(responseData.data["Max Plot"]);
      this.linedata.data[0].name = responseData.data["Max Plot"].Stat[0];
      this.linedata.data[1].name = responseData.data["Max Plot"].Stat[1];
      this.linedata.data[2].name = responseData.data["Max Plot"].Stat[2];
      // console.log(responseData.data["Line PLot"].Value)
      let xAxis:any = [];
      let firstYaxis:any = [];
      let seccondYaxis:any = [];
      let thirdYaxis:any = [];
      for (let item of responseData.data["Max Plot"].Value){
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
    }else{
      console.log("work for customize time");
      const dateStart = new Date(this.myProps.fromDate+' '+this.myProps.fromHourMinutes);
      const apiStartTime = Math.floor(dateStart.getTime());
      const endStart = new Date(this.myProps.toDate+' '+this.myProps.toHourMinutes);
      const apiEndTime = Math.floor(endStart.getTime());
      let data ={
        "Machine name": "MDB",
        "Stat name": this.myProps.stat,
        "Start time": apiStartTime.toString(),
        "End time": apiEndTime.toString(),
        "Time format": "IST"
      }
      // @ts-ignore
      let responseData = await axios.post('http://52.142.17.219:5446/api/analytics/normal_data/123-567-8910', data);
      // console.log(responseData.data["Line PLot"].Stat[0]);
      this.linedata.data[0].name = responseData.data["Max Plot"].Stat[0];
      this.linedata.data[1].name = responseData.data["Max Plot"].Stat[1];
      this.linedata.data[2].name = responseData.data["Max Plot"].Stat[2];
      // console.log(responseData.data["Line PLot"].Value)
      let xAxis:any = [];
      let firstYaxis:any = [];
      let seccondYaxis:any = [];
      let thirdYaxis:any = [];
      for (let item of responseData.data["Max Plot"].Value){
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
    }      

   }
}
</script>