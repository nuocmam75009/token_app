/* eslint-disable */
// Login Page
<template>
    <form name="login-form">
        <div class="mb-3">
            <label for="username">Username:</label>
                    <input id="username" type="text" v-model="input.username" required />
                    <!-- // v-model to store the input value in the data object -->
        </div>
        <div class="mb-3">
            <label for="password">Password:</label>
                <input id="password" type="password" v-model="input.password" required />
        </div>
        <button class="btn-primary" type="submit" v-on:clock.prevent = "login()" >
            Login
        </button>

    </form>
</template>


<script>
export default {
    name: 'LoginPage',
    data() {
        return {
            input: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            // check if the username and password are not empty
            if(this.input.username !="" || this.input.password !="") {
                console.log("authentication successful!");
            }else{
                console.log("authentication failed! Username & Password required.");
            }
        }
    }
}



</script>


      <!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

button {
    background-color: #72a1cf;
    color: white;
    padding: 15px 30px;
    font-size: 18px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    margin-top: 20px;
}
input {
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: 20%;
    margin-top: 5px;
}

label {
    font-size: 18px;
    margin-top: 10px;
    padding: 5px;
}
.mb-3 {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

input {
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: 100%;
    margin-top: 5px;
}


</style>
