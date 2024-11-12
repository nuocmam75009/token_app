<template>
  <v-container class="home-container" fluid>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>Choose your difficulty level</h1>
      </v-col>
    </v-row>
    <v-row justify="center" class="button-container">
      <v-col cols="12" sm="4" class="text-center">
        <router-link :to="{ name: 'Easymode', params: { mode: 'easy' } }">
          <v-btn color="success" class="mb-2">Easy</v-btn>
        </router-link>
      </v-col>
      <v-col cols="12" sm="4" class="text-center">
        <router-link :to="{ name: 'IntermediateMode', params: { mode: 'intermediate' } }">
          <v-btn color="warning" class="mb-2">Intermediate</v-btn>
        </router-link>
      </v-col>
      <v-col cols="12" sm="4" class="text-center">
        <router-link :to="{ name: 'HardMode', params: { mode: 'hard' } }">
          <v-btn color="error" class="mb-2">Hard</v-btn>
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
    methods:{
        startGame(difficulty) {
            this.$router.push({ name: 'game', params: { difficulty } });
        },
    },
    name: 'HomePage',
};

</script>

<style>

</style>