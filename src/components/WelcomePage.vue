<template>
    <v-container class="welcome" fluid>
      <v-row justify="center" class="text-center">
        <v-col cols="12">
          <h1 class="headline">Welcome to token.io</h1>
        </v-col>
      </v-row>

      <v-row justify="center" class="mt-4">
        <v-col cols="12" sm="5" md="3" class="d-flex justify-center">
          <v-btn
            color="primary"
            block
            prepend-icon="mdi-account"
            to="/login"
          >
            Login
          </v-btn>
        </v-col>
        <v-col cols="12" sm="5" md="3" class="d-flex justify-center mt-3 mt-sm-0">
          <v-btn
            color="secondary"
            block
            prepend-icon="mdi-account"
            to="/register"
          >
            Register
          </v-btn>
        </v-col>
      </v-row>
<!--
      <v-container class="mt-5">
        <v-row justify="center">
          <v-col
            v-for="(v, index) in data"
            :key="index"
            cols="12" sm="4" md="3"
            class="d-flex justify-center my-2"
          >
            <v-sheet class="pa-4 text-center" elevation="2" rounded>
              <v-icon color="primary">mdi-hand-pointing-right</v-icon>
              <p>{{ v }}</p>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container> -->
    </v-container>
  </template>

  <script>
  export default {
    name: 'WelcomePage',
  };
  </script>

  <style scoped>
  .welcome {
    padding: 20px;
  }

  .headline {
    font-weight: bold;
    font-size: 2.5rem;
  }

  .v-btn {
    text-transform: none;
    font-weight: 500;
  }

  .v-btn + .v-btn {
    margin-top: 16px;
  }

  .v-sheet {
    border: 1px solid #ddd;
    background-color: #f7f7f7;
    transition: background-color 0.3s ease;
  }

  .v-sheet:hover {
    background-color: #e8e8e8;
  }

  .v-icon {
    font-size: 32px;
  }

  @media (max-width: 600px) {
    .headline {
      font-size: 2rem;
    }
    .v-btn {
      width: 100%;
    }
  }
  </style>
