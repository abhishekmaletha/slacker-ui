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
        <div v-else><v-btn @click="send">send</v-btn></div>
      </div>
    </v-banner>
  </div>
</template>

<script>
const axios = require("axios");
import { mapActions, mapGetters } from "vuex";
import store from "./../store";
export default {
  name: "Home",
  data: function () {
    return {
      uid: "",
      Name: "",
    };
  },
  computed: {
    ...mapGetters("user", {
      loggedIn: "loggedIn",
      userProfile: "userProfile",
      slackInt: "slackInt",
      tested: "tested",
      UID: "UID",
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
    }),
    codeGrep() {
      // this.test({ name: "hello maletha ji" });
      // console.log("uid is ", this.uid);
      // console.log("tested is", this.tested);
      console.log("in codeGrep");
      //console.log(this.loggedIn);
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
      // console.log("uid in validator", this.uid);
      axios
        .get(`https://slacker-api-server.herokuapp.com/api/student/${this.uid}`)
        .then(function (response) {
          // console.log(response.data.webhook);
          store.commit(`user/WEBHOOK`, response.data.webhook);
          if (response.data.webhook) store.commit(`user/SLACKSTATE`);
          // console.log("webhook in state ", store.state.webhookURL);
        })
        .catch(function (error) {
          console.log("user not logged in", error);
        });
    },
  },
  mounted() {
    this.codeGrep();
    this.validator();
  },
  created() {
    this.uid = localStorage.getItem("uid");
  },
};
</script>
