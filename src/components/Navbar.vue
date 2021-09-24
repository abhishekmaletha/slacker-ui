<template>
  <v-app-bar color="deep-purple" dark app>
    <v-toolbar-title>Slacker</v-toolbar-title>
    <v-spacer />

    <v-menu offset-y v-if="loggedIn">
      <template v-slot:activator="{ on, attrs }">
        <v-avatar v-bind="attrs" v-on="on">
          <img :src="userProfile.picture" />
        </v-avatar>
      </template>
      <v-list>
        <v-list-item @click="logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn v-else text @click="login">Login</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "Navbar",
  data: () => ({}),
  props: {
    login: Function,
    loggedIn: Boolean,
    userProfile: Object,
    logout: Function,
  },
};
</script>
<style>
</style>