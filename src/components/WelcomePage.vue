/* eslint-disable */
// Welcome Page
<template>
        <div class="welcome">
            <h1>Welcome to token.io</h1>
        </div>
        <router-link to="/login">
            <button class="start">
            Start learning now!
            </button>
        </router-link>
</template>

<script>
    export default {
        name: 'WelcomePage',
    }
</script>


      <!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.start {
    background-color: #72a1cf;
    color: white;
    padding: 15px 30px;
    font-size: 18px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    margin-top: 20px;
}

</style>
