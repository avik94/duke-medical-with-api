<template>
  <v-container>
    <v-card-title>
      <v-text-field v-model="search" label="Search" single-line hide-details></v-text-field>
      <div class="flex-grow-1"></div>
      <download-csv :data="desserts">
        <v-hover>
          <template v-slot="{ hover }">
            <v-btn text fab small :elevation="hover ? 4 : 0">
              <v-icon color="green" size="25">mdi-download</v-icon>
            </v-btn>
          </template>
        </v-hover>
      </download-csv>
    </v-card-title>
    <v-data-table :headers="headers" :items="desserts" :search="search"></v-data-table>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
//@ts-ignore
import JsonCSV from "vue-json-csv";

@Component
export default class DataTable extends Vue {
  // @ts-ignore
  @Prop() dataSet;
  // @ts-ignore
  @Prop() headersItem;
  // @ts-ignore
  @Prop() searchItem;

  // Datatable Section
  search = "";
  headers = [
    {
      text: "Time Stamp",
      align: "left",
      sortable: false,
      value: "time_stamp"
    },
    { text: "Ph1_Voltage_Variation", value: "Ph1_Voltage_Variation" },
    { text: "Ph2_Voltage_Variation", value: "Ph2_Voltage_Variation" },
    { text: "Ph3_Voltage_Variation", value: "Ph3_Voltage_Variation" }
  ];
  desserts = [];

  created() {
    var parsedobj = JSON.parse(JSON.stringify(this.dataSet));
    console.log(parsedobj);
    this.desserts = parsedobj;
  }
}
</script>
