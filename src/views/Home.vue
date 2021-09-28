<template>
  <div>
    Welcome {{ userProfile.name }}

    <v-banner single-line v-if="!loggedIn">
      <v-icon slot="icon" color="warning" size="36"
        >mdi-wifi-strength-alert-outline</v-icon
      >
      unable to verify you as a real person! please log in
    </v-banner>
    <v-banner v-else two-line>
      <v-avatar slot="icon" color="deep-purple accent-4" size="40">
        <v-icon icon="mdi-lock" color="white"> mdi-lock </v-icon>
      </v-avatar>

      {{ userProfile.name }} has been logged in via Google Authentication
      <!-- <p v-if="tested">tested</p>
      <p v-else>failed</p> -->
      <div class="enable-salck" v-if="slackInt">
        <v-switch v-model="enable_slack" @click="slackSwitch()"></v-switch>
      </div>

      <div class="slack">
        <div v-if="!slackInt">
          <a
            href="https://slack.com/oauth/v2/authorize?client_id=2508798833572.2502950839362&scope=app_mentions:read,channels:join,channels:read,chat:write.customize,chat:write,commands,incoming-webhook&user_scope="
            ><img
              alt="Add to Slack"
              height="40"
              width="139"
              src="https://platform.slack-edge.com/img/add_to_slack.png"
              srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
          /></a>
        </div>
        <div v-else>
          <v-btn @click="send" v-bind="{ disabled: enable_slack }">send</v-btn>
        </div>
      </div>
    </v-banner>
  </div>
</template>

<script>
const axios = require("axios");
import { bus } from "../main";
import { mapActions, mapGetters } from "vuex";
import store from "./../store";
export default {
  name: "Home",
  data: function () {
    return {
      uid: "",
      Name: "",
      enable_slack: store.getters.enabled_slack,
    };
  },
  computed: {
    ...mapGetters("user", {
      loggedIn: "loggedIn",
      userProfile: "userProfile",
      slackInt: "slackInt",
      tested: "tested",
      UID: "UID",
      enabled_slack: "enabled_slack",
    }),
  },
  watch: {
    // uid: function (val) {console.log("uid value changed ", val),
    // Name: function (val) {console.log("uid value changed", val)
  },
  methods: {
    ...mapActions("user", {
      send: "send",
      test: "test",
      slacker: "slacker",
      toggleSlack: "toggleSlack",
    }),
    slackSwitch() {
      console.log("slack is ", this.enable_slack);
      this.toggleSlack({ uid: this.uid, slacked: this.enable_slack });
    },
    codeGrep() {
      console.log("in codeGrep");
      var urlParams = new URLSearchParams(window.location.search);
      var params = Object.fromEntries(urlParams.entries());
      var code = params.code;
      //console.log(code);
      if (code) {
        const clientID = `${process.env.VUE_SLACK_CLIENT_ID}`;
        const clientSECRET = `${process.env.VUE_SLACK_CLIENT_SECRET}`;
        axios
          .post(
            "https://slack.com/api/oauth.v2.access",
            new URLSearchParams({
              code,
              client_id: clientID,
              client_secret: clientSECRET,
            }).toString(),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          )
          .then((res) => {
            // console.log("token data ", res.data);
            this.slacker({
              webhook: res.data.incoming_webhook.url,
              uid: this.uid,
              slacked: false,
            });
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    webhookValidator() {
      // console.log("webhook validation called", store.state.webhook);
      if (store.state.webhook) store.commit(`user/slackInt`);
    },
    validator() {
      axios
        .get(`${process.env.VUE_API_HOST}student/${this.uid}`)
        .then(function (response) {
          // console.log("validator response ", response.data);
          if (response.data.webhook) {
            store.commit(`user/WEBHOOK`, response.data.webhook);
            store.commit(`user/SLACKSTATE`);
            store.commit("user/ENABLED_SLACK", response.data.slack_enabled);
            // console.log(
            //   "switch changed to ",
            //   response.data.slack_enabled,
            //   " in validator"
            // );
            bus.$emit("slack-changed", response.data.slack_enabled);
          } else console.log("webhook not set");
          // console.log("webhook in state ", store.state.webhookURL);
        })
        .catch(function (error) {
          console.log("user not logged in", error);
        });
    },
  },
  mounted() {
    console.log(this.$maletha);
    this.codeGrep();
    if (this.uid) this.validator();
    //this.enable_slack = store.getters.enabled_slack;
    //console.log("this.enable_slack ", this.enable_slack);
    // console.log("slack in mounted ", store.state.enabled_slack);
    bus.$on("slack-changed", (e) => {
      // console.log(e);
      this.enable_slack = e;
    });
  },
  created() {
    this.uid = localStorage.getItem("uid");
  },
};
</script>
