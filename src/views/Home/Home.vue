<template>
  <v-container fluid>
    <v-row v-if="alert">
      <!-- <v-col cols="12" md="6"></v-col> -->
      <v-col cols="12" md="12">
        <v-alert border="top" colored-border type="error" elevation="2">
          <b>{{errorMsg}}</b>
        </v-alert>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card height="520" class="cardBorder" elevation="9">
          <v-card-title style="border-bottom:1px solid #657d87" class="title">Input</v-card-title>
          <!-- form-content -->
          <v-form class="formContent" ref="form" v-model="valid">
            
            <v-select
              v-model="machine"
              :rules="dropdownName"
              :items="machineListName"
              prepend-icon="mdi-settings"
              label="Machine"
            ></v-select>
            <!-- <v-select
              v-model="group"
              :rules="dropdownName"
              :items="groupList"
              prepend-icon="mdi-cube"
              label="Group"
              @change="clickGroup(group)"
            ></v-select> -->
            <v-select
              v-model="stat"
              :rules="dropdownName"
              :items="statList"
              prepend-icon="mdi-math-compass"
              label="Stats"
            ></v-select>
            <v-text-field
              v-model="threshold"
              type="number"
              prepend-icon="mdi-flash"
              label="Threshold"
              required
            ></v-text-field>
            <v-select
              v-model="timeZone"
              :rules="dropdownName"
              :items="timeZoneList"
              prepend-icon="mdi-settings"
              label="Time Zone"
            ></v-select>
          </v-form>
          <!-- end -->
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card height="520" class="cardBorder" elevation="9">
          <v-card-title
            style="border-bottom:1px solid #657d87"
            class="title"
          >Customize Date Time ranges input</v-card-title>
          <v-form class="formContent1" ref="form2">
            <v-select
              v-model="quickTime"
              :items="quicktimeList"
              item-text="name"
              item-value="value"
              prepend-icon="mdi-alarm-check"
              label="Quick TIme"
            ></v-select>
          </v-form>
          <p style="margin:0;font-weight:bold" class="text-center">----OR----</p>
          <!--  -->
          <v-form class="formContent2" ref="form3">
            <!-- From date-->
            <v-menu
              ref="menu1"
              v-model="menu1"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="fromDate"
                  prepend-icon="mdi-calendar-check"
                  label="From Date"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="fromDate" no-title scrollable>
                <div class="flex-grow-1"></div>
                <v-btn text color="primary" @click="menu1 = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.menu1.save(date)">OK</v-btn>
              </v-date-picker>
            </v-menu>
            
            <v-menu
              ref="selectTime2"
              v-model="time2menu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="time2menu"
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="fromHourMinutes"
                  prepend-icon="mdi-calendar-clock"
                  label="Select Hour & Minutes"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="time2menu"
                v-model="fromHourMinutes"
                full-width
                @click:minute="$refs.selectTime2.save(fromHourMinutes)"
              ></v-time-picker>
            </v-menu>
          <!-- from date end -->
            <!-- To date-->
            <v-menu
              ref="menu2"
              v-model="menu2"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="toDate"
                  prepend-icon="mdi-calendar-check"
                  label="To Date"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="toDate" no-title scrollable>
                <div class="flex-grow-1"></div>
                <v-btn text color="primary" @click="menu2 = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.menu2.save(date)">OK</v-btn>
              </v-date-picker>
            </v-menu>
            <v-menu
              ref="selectTime1"
              v-model="time1menu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="time1menu"
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="toHourMinutes"
                  prepend-icon="mdi-calendar-clock"
                  label="Select Hour & Minutes"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="time1menu"
                v-model="toHourMinutes"
                full-width
                @click:minute="$refs.selectTime1.save(toHourMinutes)"
              ></v-time-picker>
            </v-menu>
            <!-- To date end -->
            <!-- =============================== -->
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <div class="text-center">
      <v-btn class="btnCustom" dark color="primary" @click="getData" :disabled="!valid">Submit</v-btn>
      <v-btn class="btnCustom" dark color="warning" @click="clearData" :disabled="!valid">Reset</v-btn>
    </div>
  </v-container>
</template>



<script lang="ts" src = './Home.ts'>
</script>

<style lang="scss" scoped>
.formContent {
  padding: 20px;
}
.formContent1 {
  padding: 20px 20px 0 20px;
}
.formContent2 {
  padding: 0 20px 20px 20px;
}
.cardBorder {
  border-radius: 9px;
}
.btnCustom {
  margin: 5px;
}
</style>


