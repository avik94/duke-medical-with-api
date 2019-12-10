<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="5">
        <v-card elevation="9" class="cardBorder">
          <v-card-title class="cardTitle">
            <v-row>
              <v-col cols="6">
                <p>INPUT DATA</p>
              </v-col>
              <v-col cols="6" class="text-right">
                <v-hover>
                  <template v-slot="{ hover }">
                    <v-btn text fab small :elevation="hover ? 4 : 0" to="/">
                      <v-icon color="primary" size="20">mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                </v-hover>
              </v-col>
            </v-row>
          </v-card-title>
          <div class="cardContent">
            <p>
              <span>
                <v-icon color="primary" size="20" style="padding-right:5px">mdi-settings</v-icon>
              </span>
              <b>Machine:&nbsp;</b>
              {{formData.machine}}
            </p>
            <p>
              <span>
                <v-icon color="primary" size="20" style="padding-right:5px">mdi-cube</v-icon>
              </span>
              <b>Group:&nbsp;</b>
              {{formData.group}}
            </p>
            <p>
              <span>
                <v-icon color="primary" size="20" style="padding-right:5px">mdi-math-compass</v-icon>
              </span>
              <b>Stat:&nbsp;</b>
              {{formData.stat}}
            </p>
            <p>
              <span>
                <v-icon color="primary" size="20" style="padding-right:5px">mdi-flash</v-icon>
              </span>
              <b>Threshold:&nbsp;</b>
              {{formData.threshold}}
            </p>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="7">
        <v-card elevation="7" class="cardBorder timeCardHeight">
          <v-card-title class="cardTitle">
            <v-row>
              <v-col cols="6">
                <p>INPUT TIME</p>
              </v-col>
            </v-row>
          </v-card-title>
          <div v-if="quickTime" class="cardContent">
            <table>
              <tr>
                <td
                  class="text-center"
                  style="font-size:14px;color:#1976d2;font-weight: bold;padding: 10px 17px;background:aliceblue;"
                >LOCAL</td>
                <td class="time">{{quickTimeLocal | moment("DD-MM-YYYY HH:mm:a")}}</td>
              </tr>
              <tr>
                <td
                  class="text-center"
                  style="font-size:14px;color:#1976d2;font-weight: bold;padding: 10px 17px;background:aliceblue;"
                >UTC</td>
                <td class="time">{{quickTimeUtc | moment("DD-MM-YYYY HH:mm:a")}}</td>
              </tr>
              <tr>
                <td
                  class="text-center"
                  style="font-size:14px;color:#1976d2;font-weight: bold;padding: 10px 17px;background:aliceblue;"
                >EST</td>
                <td class="time">{{quickTimeEst | moment("DD-MM-YYYY HH:mm:a")}}</td>
              </tr>
            </table>
          </div>
          <div v-if="customTime" class="cardContent">
            <table>
              <tr>
                <th></th>
                <th>From</th>
                <th>To</th>
              </tr>
              <tr>
                <td
                  class="text-center"
                  style="font-size:15px;color:#1976d2;font-weight: bold;padding: 10px 17px;background:aliceblue;"
                >LOCAL</td>
                <td
                  class="time"
                  style="border-top:1px solid #f2f2f2"
                >{{localDateTimeTo | moment("DD-MM-YYYY HH:mm:a")}}</td>
                <td
                  class="time"
                  style="border-top:1px solid #f2f2f2"
                >{{localDateTimeFrom | moment("DD-MM-YYYY HH:mm:a")}}</td>
              </tr>
              <tr>
                <td
                  class="text-center"
                  style="font-size:14px;color:#1976d2;font-weight: bold;padding: 10px 17px;background:aliceblue"
                >UTC</td>
                <td class="time">{{utcDateTimeTo | moment("DD-MM-YYYY HH:mm:a")}}</td>
                <td class="time">{{utcDateTimeFrom | moment("DD-MM-YYYY HH:mm:a")}}</td>
              </tr>
              <tr>
                <td
                  class="text-center"
                  style="font-size:14px;color:#1976d2;font-weight: bold;padding: 10px 17px;background:aliceblue"
                >EST</td>
                <td class="time">{{estDateTimeTo | moment("DD-MM-YYYY HH:mm:a")}}</td>
                <td class="time">{{estDateTimeFrom | moment("DD-MM-YYYY HH:mm:a")}}</td>
              </tr>
            </table>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3" v-for="item in buttonList" :key="item.name">
        <div class="text-center">
          <v-btn :color="item.color" medium min-width="220px" :to="item.url">{{item.name}}</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang = "scss" scoped>
.cardTitle {
  border-bottom: 1px solid #8080803d;
  height: 57px;
  padding: 0 20px;
}
.cardContent p {
  border-bottom: 1px solid #8080803d;
  color: #363535b9;
  padding-bottom: 7px;
}
.cardContent {
  padding: 20px;
}
.cardBorder {
  border-radius: 7px;
}
.time {
  font-size: 15px;
  padding: 10px 17px;
  border-bottom: 1px solid #f2f2f2;
}
.cardTitle p {
  margin-bottom: 0;
  font-size: 17px;
  font-weight: bold;
  color: #303131;
  letter-spacing: 0.3px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component
export default class ShowData extends Vue {
  formData!: any;
  quickTime = false;
  customTime = false;
  buttonList = [
    { name: "Data Table", color: "success", url: "data-view/data-table" },
    { name: "Line Plot", color: "primary", url: "data-view/line-plot" },
    // { name: "FFT", color: "info", url: "data-view/fft" },
    { name: "PSD", color: "warning", url: "data-view/psd" }
  ];

  //time variables
  quickTimeLocal?: any;
  quickTimeUtc?: any;
  quickTimeEst?: any;

  localDateTimeFrom?: any;
  utcDateTimeFrom?: any;
  estDateTimeFrom?: any;

  localDateTimeTo?: any;
  utcDateTimeTo?: any;
  estDateTimeTo?: any;
  // end

  created() {
    this.formData = this.$store.state.formData;
    if (!this.formData.quickTime) {
      this.customTime = true;
      let x = this.timeConvertCustom(
        this.$store.state.formData.fromDate,
        this.$store.state.formData.fromHourMinutes
      );
      this.localDateTimeFrom = x.localDateTime;
      this.utcDateTimeFrom = x.utcDateTime;
      this.estDateTimeFrom = x.estDateTime;

      let y = this.timeConvertCustom(
        this.$store.state.formData.toDate,
        this.$store.state.formData.toHourMinutes
      );
      this.localDateTimeTo = y.localDateTime;
      this.utcDateTimeTo = y.utcDateTime;
      this.estDateTimeTo = y.estDateTime;
    } else {
      this.quickTime = true;
      let timeValueArray = this.formData.quickTime.split("");
      let i = timeValueArray[timeValueArray.length - 1];
      timeValueArray.pop();
      let min = timeValueArray.join("");
      // console.log(min,i)
      let quickTimeData: any = this.quickTimeConvert(parseInt(min), i);
      this.quickTimeLocal = quickTimeData.quickLocalDateTime;
      this.quickTimeUtc = quickTimeData.quickUtcDateTime;
      this.quickTimeEst = quickTimeData.quickEstDateTime;
    }
  }

  timeConvertCustom(date: string, time: string) {
    let localDate = new Date(date + " " + time);

    let utcDate = localDate.getTime() + localDate.getTimezoneOffset() * 60000;
    let estDate = new Date(utcDate + 3600000 * -5.0);
    let result = {
      localDateTime: localDate,
      utcDateTime: new Date(utcDate),
      estDateTime: estDate
    };
    return result;
  }

  quickTimeConvert(min: number, i: string) {
    // let i = "d";
    // let min = 2;
    if (i === "m") {
      let timedate = new Date(Date.now() - 60000 * min);
      let utcDate = timedate.getTime() + timedate.getTimezoneOffset() * 60000;
      let estDate = new Date(utcDate + 3600000 * -5.0);
      let result = {
        quickLocalDateTime: timedate,
        quickUtcDateTime: new Date(utcDate),
        quickEstDateTime: estDate
      };
      return result;
    } else if (i === "h") {
      let timedate = new Date(Date.now() - 1000 * 3600 * min);
      let utcDate = timedate.getTime() + timedate.getTimezoneOffset() * 60000;
      let estDate = new Date(utcDate + 3600000 * -5.0);
      let result = {
        quickLocalDateTime: timedate,
        quickUtcDateTime: new Date(utcDate),
        quickEstDateTime: estDate
      };
      return result;
    } else if (i === "d") {
      let timedate = new Date(Date.now() - 1000 * 3600 * 24 * min);
      let utcDate = timedate.getTime() + timedate.getTimezoneOffset() * 60000;
      let estDate = new Date(utcDate + 3600000 * -5.0);
      let result = {
        quickLocalDateTime: timedate,
        quickUtcDateTime: new Date(utcDate),
        quickEstDateTime: estDate
      };
      return result;
    }

    let localDate = new Date();
  }
}
</script>


