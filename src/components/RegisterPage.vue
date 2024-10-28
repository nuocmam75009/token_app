<template>
    <v-container>
        <v-sheet class="mx-auto" width="500">
        <v-form @submit.prevent="registerUser">
            <v-text-field v-model="email" label="Email" required></v-text-field>
            <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
            <v-text-field v-model="firstName" label="First Name" required></v-text-field>
            <v-text-field v-model="lastName" label="Last Name" required></v-text-field>

            <v-btn type="submit" color="blue" class="my-2" width="100%">Register</v-btn>
            <v-btn @click="LoginWithGoogle" class="my-2" width="100%" color="blue">Sign in with your Google account</v-btn>

      </v-form>
    </v-sheet>

    </v-container>
  </template>


<script>

import { auth, db } from "../../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, googleProvider } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';



export default {
  data() {
    return {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      results: [],
    };
  },
  methods: {
    async registerUser() {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        // Store additional user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          results: [],
        });

        // Redirect to dashboard or login
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Error registering user:', error);
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


<style>


</style>
