<template>

<v-app>

      <v-navigation-drawer
      app
      expand-on-hover
      rail
      background="grey lighten-2"
      open-delay="200"
      >
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home" to="/homepage">
          Homepage
        </v-list-item>
        <v-list-item prepend-icon="mdi-account" to="/userdashboard">
          My Dashboard
        </v-list-item>
        <v-list-item prepend-icon="mdi-book" to="/resources">
          My Notebook
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
  data() {
    return {
      drawer: false,
    }
  }

};

</script>

<style scoped>

.v-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.v-main {
  flex-grow: 1;
  padding: 16px;
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
}
.v-navigation-drawer {
  position: fixed;
}

.v-btn {
  font-weight: bold;
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
  padding: 8px;
}
</style>
