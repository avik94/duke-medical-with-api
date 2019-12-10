<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <p>{{myProps}}</p>
      </v-col>
      <v-col cols="4">
        <v-select
              v-model="eventTime"
              :items="dateDropDown"
              label="Event Time">
        </v-select>
      </v-col>   
      <v-col cols="4">
        <v-select
              v-model="statEvent"
              :items="statDropdown"
              label="Stats">
        </v-select>
      </v-col>
      <v-col cols="2" style="padding-top:30px">
        <v-btn color="primary lighten-2" dark >Submit</v-btn>
      </v-col>    
    </v-row>
    <v-row>
      <v-col cols = "12">
        <!-- line-plot -->
        <v-card flat color="basil">
          <vue-plotly
            :data="linedata.data"
            :layout="linedata.layout"
            :options="linedata.options"
          />
        </v-card>
        <!-- line-plot end -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
//@ts-ignore
import VuePlotly from "@statnett/vue-plotly";
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
    console.log(val,oldVal)
  }
  // @ts-ignore
  @Prop() statData;

  eventTime = "";
  statEvent = "";
  
  created(){ 
    // this.statDropdown = this.statData;
  }

  dateDropDown = ["26-11-2019 15:30", "27-11-2019 17:30"];
  statDropdown = ["Voltage", "Current", "Frequency Variaion"]; // it will be changed later

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
}
</script>
