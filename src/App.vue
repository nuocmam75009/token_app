
<template>
  <img alt="Vue_logo" src="./assets/logo.png">
  <div id="app">
    <header>
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/login">Login</router-link>
      </nav>
    </header>
    <router-view/>
    <footer>
      <p>
        &copy; 2024 Token.io by Lucas
      </p>
      <p>
        End of year project for Holberton School's Fundamentals program.
      </p>
    </footer>

  </div>
</template>




<script>

// import WelcomePage from './components/WelcomePage.vue'

export default {
  name: 'App',
  // components: {
  //   WelcomePage,
  // }
}

</script>


















<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
