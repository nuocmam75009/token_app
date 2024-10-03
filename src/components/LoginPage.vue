/* eslint-disable */
// Login Page
<template>
    <form name="login-form">
        <div class="mb-3">
            <label for="username">
                Username:
            </label>
                    <input id="username" type="text" name="username" required>
        </div>
        <div class="mb-3">
            <label for="password">
                Password:
            </label>
                <input id="password" type="password" name="password" required>
        </div>
        <button class="btn btn-primary" type="submit">
            Login
        </button>

    </form>
</template>



<script>


    export default {
        name: 'LoginPage',
    }

</script>


      <!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
