
<template>
  <!--  <img id="vue_logo" alt="Vue_logo" src="./assets/logo.png">  -->
    <v-app>
  <v-app-bar :elevation="6" app color="blue darken-1" dark fixed>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

  <!-- <v-toolbar-title>Token.io</v-toolbar-title> -->
    <v-spacer></v-spacer>


    <div class="nav-links">

      <router-link to="/homepage" class="v-btn" exact>
        Homepage
      </router-link>

      <router-link to="/resources" class="v-btn" exact>
        Resources
      </router-link>

      <router-link to="/userdashboard" class="v-btn" exact>
        My Dashboard
      </router-link>

    </div>
  </v-app-bar>

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
}
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
