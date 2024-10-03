
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
        &copy; 2024 token.io
      </p>
      <!-- <p>
        End of year project for Holberton School's CS Fundamentals program.
      </p> -->
    </footer>

  </div>
</template>

<script>
export default {
  name: 'App',
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

header {
  background-color: #72a1cf;
  color: white;
  padding: 10px;
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

header nav {
  margin-right: 20px;
  padding: 10px;
}

footer {
  background-color: #72a1cf;
  color: white;
  padding: 10px;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

#app {
  margin-top: 80px; /* Adjust this value if needed to avoid content being hidden behind the header */
}
</style>
