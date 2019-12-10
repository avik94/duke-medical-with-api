<template>
  <v-app>
    <v-navigation-drawer app dark class="leftSidebar" v-model="drawer" :width="350">
      <div class="text-center headerSidebar">
        <img
          style="border-radius: 50%;"
          class="profilePic"
          src="./assets/boy.svg"
          alt
        />
        <v-card-text class="white--text">I'm card text</v-card-text>
      </div>
      <v-list height="5" shaped dense nav>
        <v-list-item v-for="item in items" :key="item.title" :to="item.url">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="subtitle-2">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dark class="navbarHeader" height="50">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <h3 style="padding-left:30px;color:rgb(81, 77, 77);">Expert Power Quality Analyzer</h3>
    </v-app-bar>

    <v-content class="contentBackground">
      <router-view  />
    </v-content>
  </v-app>
</template>

<style lang="scss">
.profilePic {
  height: 80px;
  width: 80px;
  margin-bottom: 8px;
  border: 2px solid pink;
  background: #37373f;
}
.headerSidebar {
  background: url(./assets/material-background.png) 0 0 / cover no-repeat;
  padding: 15px;
}
.navbarHeader{
  background-image: linear-gradient(to left, red , #ff9800 );
}
.leftSidebar{
  background-image: linear-gradient(to bottom, #090d11 , #0c1469 );
}
.contentBackground{
  background: #e6edf0;
}
</style>
<script lang="ts">
import Vue from "vue";
import {Component} from "vue-property-decorator"
@Component
export default class App extends Vue {
  drawer = null
    items =  [
      { title: "Dashboard", icon: "mdi-view-dashboard", url: "/" },
      { title: "User Profile", icon: "mdi-image", url: "/about" },
      { title: "Company Details", icon: "mdi-help-box"},
      { title: "Installation Guide", icon: "mdi-view-dashboard" },
      { title: "Settings", icon: "mdi-image" },
      { title: "About", icon: "mdi-image" },
      { title: "Terms & Conditions", icon: "mdi-image" },
      { title: "Privacy Policy", icon: "mdi-image" }
    ]
}
</script>
