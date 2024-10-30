<template>

<v-app>
      <v-navigation-drawer
      app
      expand-on-hover
      rail
      background="grey lighten-2"
      open-delay="200"
      >

      <v-list>
        <v-list-item>

          </v-list-item>
      </v-list>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home" to="/homepage">
          Homepage
        </v-list-item>
        <v-list-item prepend-icon="mdi-account" to="/userdashboard">
          My Dashboard
        </v-list-item>
        <v-list-item prepend-icon="mdi-book" to="/test">
          Resources
        </v-list-item>
        <v-list-item prepend-icon="mdi-account-arrow-right" to="/">
          Sign out
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view/>
    </v-main>

    <v-footer app color="blue darken-1" dark fixed>
      <span class="white--text">&copy; 2024 Token.io</span>
    </v-footer>
</v-app>

</template>

<script>

export default {
  name: 'App',
};

</script>

<style>

.v-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.v-main {
  flex-grow: 1;
}

.content {
  padding-top: 2px;
  padding-bottom: 64px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}

.v-btn {
  font-weight: bold;
  margin-left: 30px;
}

.nav-links {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.router-link {
  margin-right: 10px;
}

.v-footer {
  margin-bottom: 2px;
}
</style>
