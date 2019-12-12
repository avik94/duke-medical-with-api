<template>
  <v-container fluid>
    <v-row style="padding: 0 6px;">
      <v-col cols="12">
        <!-- machine & stat row start -->
        <v-row>
          <v-col cols="4">
            <v-select :items="machineList" label="Machine" v-model="machine" ></v-select>
          </v-col>
          <!-- <v-col cols="3">
            <v-select :items="groupList" label="Group" v-model="group" 
              @change="clickGroup(group)"></v-select>
          </v-col> -->
          <v-col cols="4">
            <v-select :items="statList" label="Stat" v-model="stat" @change="clickStat(stat)"></v-select>
          </v-col>
          <v-col cols="3" style="padding-top: 20px;">
            <!-- "Change input time Dialog" -->
            <v-btn text color="primary lighten-2" dark @click.stop="dialog = true">Change Input Time</v-btn>
            <v-dialog width="380" style="margin-left:20px" v-model="dialog">
              <v-card>
                <div class="cardContent">
                  <v-form class="formContent1" ref="formQuickTime">
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
                  <v-form class="formContent2" ref="formCustomTime">
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
                          :rules="number"
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
                    <!-- To date end -->
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
                          :rules="number"
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
                          :rules="number"
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
                    <!-- from date end -->
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
                          :rules="number"
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
                  </v-form>
                </div>
                <div class="text-center" style="padding-bottom:20px;">
                  <v-btn dark color="primary" @click="submitTimeInput()" style="margin-right:10px;">Submit</v-btn>
                  <v-btn color="warning" dark @click="clearInput()">Clear</v-btn>
                </div>
              </v-card>
            </v-dialog>
            <!-- end input time dialog -->
          </v-col>
          <v-col cols="1" style="padding-top: 20px;">
            <!-- "Gear Dialog" show only input data -->
            <v-dialog width="300" style="margin-left:20px">
              <template v-slot:activator="{ on }">
                <v-btn icon color="secondary lighten-2" dark v-on="on">
                  <v-icon>mdi-settings</v-icon>
                </v-btn>
              </template>
              <v-card>
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
            </v-dialog>
            <!-- end gear dialog -->
          </v-col>
        </v-row>
        <!-- machine & stat row end -->
      </v-col>
    </v-row>

    <!-- ============================================================================
    ============================================================================-->
    <!-- tab section start here -->
    <v-row>
      <v-col cols="12">
        <v-card v-if="maxMin">
          <v-tabs v-model="tab" background-color="transparent" color="#072d97" grow>
            <v-tab v-for="(item, index) in items" :key="index">{{ item }} </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item >
              <!-- line-plot -->
              <v-card flat color="basil" >
               <LinePlot :myProps ="allData"/>
              </v-card>
              <!-- line-plot end -->
            </v-tab-item>
            <v-tab-item >
              <v-card flat color="basil">
                <!-- <v-card-text>Max</v-card-text> -->
                <MaxLine :myProps ="allData"/>
              </v-card>
            </v-tab-item >
            <v-tab-item >
              <v-card flat color="basil">
                <MinLine :myProps ="allData"/>
              </v-card>
            </v-tab-item> 
            <!-- <v-tab-item >
              <v-card flat color="basil">
                <v-card-text>FFT</v-card-text>
              </v-card>
            </v-tab-item> -->
            <v-tab-item>
              <v-card flat color="basil">
                <EventTrap :statData="statList" :myProps ="allData"></EventTrap>
              </v-card>
            </v-tab-item> 
            <v-tab-item>
              <!-- data-table -->
              <v-card class="tabContent">
                  <DataTable></DataTable>
              </v-card>
              <!-- data-table-end -->
            </v-tab-item>          
          </v-tabs-items>
        </v-card>

        <v-card v-if="normal">
          <v-tabs v-model="tab" background-color="transparent" color="#072d97" grow>
            <v-tab v-for="(item, index) in items" :key="index">{{ item }} </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <!-- line plot -->
            <v-tab-item >
              <!-- line-plot -->
              <v-card flat color="basil">
                <LinePlot :myProps ="allData"/>
              </v-card>
              <!-- line-plot end -->
            </v-tab-item>
            <!-- end line plot -->
            <!-- fft -->
            <!-- <v-tab-item >
              <v-card flat color="basil">
                <v-card-text>FFT</v-card-text>
              </v-card>
            </v-tab-item> -->
            <!-- end fft -->
            <!-- event trap -->
            <v-tab-item>
              <v-card flat color="basil">
                <EventTrap :statData="statList" :myProps ="allData"></EventTrap>
              </v-card>
            </v-tab-item> 
            <!-- end event trap -->
            <!-- data table -->
            <v-tab-item>
              <!-- data-table -->
              <v-card class="tabContent">
                <DataTable></DataTable>
              </v-card>
              <!-- data-table-end -->
            </v-tab-item>    
            <!-- end data table -->
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" src = "./Statistics.ts">
</script>

<style lang = "scss" scoped>
.tabContent {
  padding: 35px;
}
.cardContent p {
  border-bottom: 1px solid #8080803d;
  color: #363535b9;
  padding-bottom: 7px;
}
.cardContent {
  padding: 20px;
}
</style>