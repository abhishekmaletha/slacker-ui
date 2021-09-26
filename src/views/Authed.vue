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
      <div class="slack">
        <div v-if="!slackInt">
          <a
            href="https://slack.com/oauth/v2/authorize?client_id=2508798833572.2502950839362&scope=app_mentions:read,channels:join,channels:read,chat:write.customize,chat:write,commands,incoming-webhook&user_scope="
            target="._blank"
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
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Authed",
  computed: {
    ...mapGetters("user", {
      loggedIn: "loggedIn",
      userProfile: "userProfile",
      slackInt: "slackInt",
    }),
  },
  methods: {
    ...mapActions("user", {
      send: "send",
    }),
  },
};
</script>
