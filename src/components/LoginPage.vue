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
    <!-- <h3>Output: {{ this.output }}  </h3> -->
</template>


<script>
import { SET_AUTHENTICATION, SET_USERNAME } from '@/store/storeconstants';
import { auth } from "../../config/firebase";


export default {
    name: 'LoginPage',
    data() {
        return {
            input: {
                username: "",
                password: ""
            },
            output: "",
        }
    },
    methods: {
        async login() {
            // check if the username and password are not empty
            if(this.input.username !="" && this.input.password !="") {
                try {
                    // sign in the user with the email and password
                    await auth.signInWithEmailAndPassword(this.input.username, this.input.password);
                    this.output = "authentication successful!";
                    // set the authentication state to true
                    this.$store.commit(`auth/${SET_AUTHENTICATION}`, true);
                    this.$store.commit(`auth/${SET_USERNAME}`, this.input.username);
                } catch (error) {
                    // Log & display error if auth fails
                    this.output = error.message;
                    this.$store.commit(`auth/${SET_AUTHENTICATION}`, false);
                }
            } else {
                // Display error if username and password are empty
                this.output = "Username and password cannot be empty!";
                this.$store.commit(`auth/${SET_AUTHENTICATION}`, false);
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
