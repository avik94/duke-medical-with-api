<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>User Name</v-card-title>
          <v-card-text>User Details</v-card-text>
          <v-card-actions>
            <v-btn text>Click</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import axios from 'axios';

@Component
export default class About extends Vue {

  created(){}
}
</script>
