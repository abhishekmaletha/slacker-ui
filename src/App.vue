<template>
  <v-app>
    <Navbar
      :login="login"
      :logout="logout"
      :userProfile="userProfile"
      :loggedIn="loggedIn"
    />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
    <v-footer padless>
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Navbar from "@/components/Navbar.vue";

export default {
  name: "App",
  components: { Navbar },
  computed: {
    ...mapGetters("user", {
      userProfile: "userProfile",
      loggedIn: "loggedIn",
    }),
  },
  methods: {
    ...mapActions("user", {
      login: "login",
      logout: "logout",
    }),
  },
};
</script>
