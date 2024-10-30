<template>
    <v-container>
        <v-sheet class="mx-auto grey lighten-3" width="500">
            <v-card class="mx-auto px-6 py-8" max-width="auto">
            <v-form v-model="form" @submit.prevent="login">
                <v-text-field v-model="email" label="Email" required></v-text-field>
                <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
                <br/>
                <br/>
                <v-btn prepend-icon="mdi-account" type="submit" color="blue" class="my-2">Login</v-btn>
                <v-btn prepend-icon="mdi-account" @click="loginWithGoogle" class="my-2" color="blue">Sign in with your Google account</v-btn>
                <v-alert v-if="errorMessage" type="error" class="mt-4">{{ errorMessage }}</v-alert>

            </v-form>
    </v-card>
    </v-sheet>

    </v-container>

</template>


<script>
import { SET_AUTHENTICATION, SET_USERNAME } from '@/store/storeconstants';
import { auth, googleProvider } from "../../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';


export default {
    name: 'LoginPage',
    data() {
        return {
            input: {
                email: "",
                password: "",
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
        async loginWithGoogle() {
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
