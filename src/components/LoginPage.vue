// Login Page
<template>
    <form name="login-form" @submit.prevent="login">
        <div class="mb-3">
            <label for="username">Email adress:</label>
                    <input
                    id="username"
                    type="text"
                    v-model="input.email" required
                    placeholder="Enter your email adress babygirl"
                    />
                    <!-- // v-model to store the input value in the data object -->
        </div>
        <div class="mb-3">
            <label for="password">Password:</label>
                <input
                id="password"
                type="password"
                v-model="input.password"
                required
                placeholder="Enter your password babygirl"
                />
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
import { signInWithEmailAndPassword } from 'firebase/auth';




export default {
    name: 'LoginPage',
    data() {
        return {
            input: {
                email: "",
                password: ""
            },
            error: "", // store error message
        }
    },
    methods: {
        async login() {
            // Using Vuex to manage login state.
            // Commit the authentication state to true if the user is authenticated
            // Redirecting to dashboard if the user is authenticated
            // Handling error: no empty username and password

            if (this.input.email && this.input.password) {
                try {
                    const userCredential = await signInWithEmailAndPassword(
                        auth,
                        this.input.email,
                        this.input.password
                    );
                    // Get authenticated user's info
                    const user = userCredential.user;

                    // Successful login
                    this.$store.commot(`auth/${SET_AUTHENTICATION}`, true);
                    this.$store.commit(`auth/${SET_USERNAME}`, user.email);

                    // Routing to dashboard :) :) hihi
                    this.$router.push('/userdashboard');

                } catch (error) {
                    // Unsuccessful login
                    this.output = error.message;
                    this.$store.commit(`auth/${SET_AUTHENTICATION}`, false);
                }
            } else {
                // Display error if empty
                this.error = "Username and password cannot be empty babygirl!";
            }
        }
    }
};


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
