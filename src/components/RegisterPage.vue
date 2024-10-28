// Login Page
<template>
    <form name="login-form" @submit.prevent="login">
        <div class="mb-3">
            <label for="username">Email address:</label>
            <input
                id="username"
                type="text"
                v-model="input.email"
                required
                placeholder="Enter your email address"
            />
            <!-- v-model to store the input value in the data object -->
        </div>
        <div class="mb-3">
            <label for="password">Password:</label>
            <input
                id="password"
                type="password"
                v-model="input.password"
                required
                placeholder="Enter your password"
            />
        </div>
        <button class="btn-primary" type="submit">
            Login
        </button>
    </form>

    <div class="google-login">
        <h2>
            <button @click="LoginWithGoogle">
                Sign in with your Google account
            </button>
        </h2>
    </div>
    <!-- <h3>Output: {{ this.output }}  </h3> -->
</template>


<script>
import { SET_AUTHENTICATION, SET_USERNAME } from '@/store/storeconstants';
import { auth, googleProvider } from "../../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';


export default {
    name: 'RegisterPage',
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

                    // Commit to Vuex store
                    this.$store.commit(`auth/${SET_AUTHENTICATION}`, true);
                    this.$store.commit(`auth/${SET_USERNAME}`, user.email);

                    // Routing to dashboard :) :) hihi
                    this.$router.push({
                        path: '/userdashboard',
                        query: {
                            results: JSON.stringify(this.results), // pass results as query params
                        }
                    });

                } catch (error) {
                    // Unsuccessful login
                    this.error = "Invalid username or password";
                }
            } else {
                // Display error if empty
                this.error = "Username and password cannot be empty";
            }
        },
        async LoginWithGoogle() {
            // Login with Google
            try {
                // Creates Google Access Token for Google's API
                // user stores the user's info
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;
                console.log("User info:", user);
                // As normal login, redirects to user dashboard
                this.$router.push('/userdashboard');
            } catch (error) {
                console.error("Error signing in with Google:", error);
            }
        },
    },
};


</script>


      <!-- Add "scoped" attribute to limit CSS to this component only -->
<style>


</style>
