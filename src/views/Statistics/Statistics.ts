import Vue from "vue";
import { Component } from "vue-property-decorator";
//@ts-ignore
import VuePlotly from "@statnett/vue-plotly";
//@ts-ignore
import JsonCSV from "vue-json-csv";
import EventTrap from "../../components/EventTrap.vue";
import DataTable from "../../components/DataTable.vue";
import LinePlot from "../../components/LinePlot.vue";
import MaxLine from "../../components/MaxLine.vue";
import MinLine from "../../components/MinLine.vue";

Vue.component("downloadCsv", JsonCSV);

@Component({
  components: {
    VuePlotly,
    EventTrap,
    DataTable,
    LinePlot,
    MaxLine,
    MinLine
  }
})


export default class Statistics extends Vue {
  // avik:any = "";
  // calender
  menu1 = false;
  menu2 = false;
  date = new Date().toISOString().substr(0, 10);
  // calender end
  time1 = false;
  time1menu = false;
  time2menu = false;
  time1modal = false;

  // max min logic
  maxMin?:boolean;
  normal?:boolean;
  noEventTab?: boolean;

  formData!: any;

  // tab section
  tab: any = 0;
  machineList = [];
  statList:string[] = [];
  groupList = ["MRI Health", "Energy Audit", "Drive Health"];
  items = ["Line Plot", "Max", "Min","Event Trap", "Data Table"]; 
  // tab section end


  created() {
    let data = JSON.parse(sessionStorage.form);
    let machineList = JSON.parse(sessionStorage.machineList)
    let statItems = JSON.parse(sessionStorage.statList)
    this.formData = this.$store.state.formData;
    this.allData = this.formData;
    this.machineList = machineList;
    this.machine = data.machine;
    this.stat = data.stat;
    this.group = data.group;
    // this.threshold = data.threshold;
    this.toDate = data.toDate;
    this.toHourMinutes = data.toHourMinutes;
    this.fromDate = data.fromDate;
    this.fromHourMinutes = data.fromHourMinutes;
    this.quickTime  = data.quickTime;
    this.timeZone = data.timeZone;
    this.statList = statItems;

    if(this.stat === "Voltage(L-N)" || this.stat === "Voltage(L-L)" || this.stat === "Current-3 phase"){
      this.items = ["Line Plot", "Max", "Min", "Data Table"];
      this.maxMin = true;
      this.normal = false;
      this.noEventTab = false;
      this.tab = 0;  
    }else if(this.stat === "PF-3 phase" || this.stat === "Neutral current"){
      this.items = ["Line Plot", "Data Table"];
      this.maxMin = false;
      this.normal = false;
      this.noEventTab = true;
      this.tab = 0;
    }else{
      this.items = ["Line Plot", "Event Trap", "Data Table"];
      this.maxMin = false;
      this.normal = true;
      this.noEventTab = false;
      this.tab = 0;
    }
  }


  // ==========================================
  // dialog form for input start from here
  machine = "";
  group = "";
  stat = "";
  threshold = "";
  toDate = "";
  toHourMinutes = "";
  fromDate = "";
  fromHourMinutes = "";
  quickTime  = "";
  timeZone = "";

  allData:any = {};

  dialog = false;
  number = [
    (v:any) => !!v || 'data is required',
  ]
  dropdownName = [
    (v:any) => !!v || 'data is required',
  ]

  quicktimeList = [
    { name: "5 Minutes", value: "5m" },
    { name: "10 Minutes", value: "10m" },
    { name: "15 Minutes", value: "15m" },
    { name: "30 Minutes", value: "30m" },
    { name: "1 Hours", value: "1h" },
    { name: "3 Hours", value: "3h" },
    { name: "6 Hours", value: "6h" },
    { name: "12 Hours", value: "12h" },
    { name: "24 Hours", value: "24h" },
    { name: "2 Days", value: "2d" },
    { name: "3 Days", value: "3d" }
  ];

  submitTimeInput(){
    this.dialog = false;
    let data = {
      machine: this.machine,
      stat: this.stat,
      group: this.group,
      threshold: this.threshold,
      quickTime: this.quickTime,
      fromDate: this.fromDate,
      fromHourMinutes: this.fromHourMinutes,
      toDate: this.toDate,
      toHourMinutes: this.toHourMinutes,
      timeZone: this.timeZone
    }
    // console.log(this.machine);
    // console.log(this.stat);
    // console.log(this.group);
    // console.log(this.threshold);
    // console.log(this.quickTime);
    // console.log(this.fromDate);
    // console.log(this.fromHourMinutes);
    // console.log(this.toDate);
    // console.log(this.toHourMinutes);
    sessionStorage.setItem('form', JSON.stringify(data));
    // this.tab = 0;
    this.allData = data;
    
  }

  clearInput(){
    this.dialog = true;
    //@ts-ignore
    this.$refs.formQuickTime.reset();
    //@ts-ignore
    this.$refs.formCustomTime.reset()
  }

  
  clickStat(data:any){
    if(data === "Voltage(L-N)" || data === "Voltage(L-L)" || data === "Current-3 phase"){
      this.items = ["Line Plot", "Max", "Min", "Data Table"];
      this.maxMin = true;
      this.normal = false;
      this.noEventTab = false;
      // this.tab = 0;
    }
    else if(data === "PF-3 phase" || data === "Neutral current"){
      this.items = ["Line Plot", "Data Table"];
      this.maxMin = false;
      this.normal = false;
      this.noEventTab = true;
      // this.tab = 0;
    }
    else{
      this.items = ["Line Plot", "Event Trap", "Data Table"];
      this.maxMin = false;
      this.normal = true;
      this.noEventTab = false;
      // this.tab = 0;
    }
  }
}                                                                                                                                                                                                                                                                              