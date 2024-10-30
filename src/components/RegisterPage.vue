<template>
    <v-container>
        <v-sheet class="mx-auto grey lighten-3" width="500">
            <v-card class="mx-auto px-6 py-8" max-width="auto">
            <v-form v-model="form" @submit.prevent="registerUser">
                <v-text-field v-model="email" label="Email" required></v-text-field>
                <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
                <v-text-field v-model="firstName" label="First Name" required></v-text-field>
                <v-text-field v-model="lastName" label="Last Name" required></v-text-field>
                <br/>
                <br/>
                <v-btn prepend-icon="mdi-account" type="submit" color="blue" class="my-2">Create a new account</v-btn>
                <v-btn prepend-icon="mdi-account" @click="loginWithGoogle" class="my-2" color="blue">Sign in with your Google account</v-btn>
                <v-alert v-if="errorMessage" type="error" class="mt-4">{{ errorMessage }}</v-alert>

            </v-form>
    </v-card>
    </v-sheet>

    </v-container>

</template>


<script>

import { auth, db } from "../../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      results: [],
      googleLoading: false,
      isFormValid: false,
      errorMessage: '',

      // Validation rules
      emailsRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be at least 6 characters',
      ],
      nameRules: [
        v => !!v || 'Username is required',
        v => v.length >= 3 || 'Username must be at least 3 characters',
        v => /.+@.+\..+/.test(v) || 'Username can not contain special characters',
      ],
    };
  },
  methods: {
    async registerUser() {
      try {
        // Make sure form is valid
        if (!this.$refs.form.validate()) {
          return;
        }

        this.loading = true;
        this.errorMessage = '';

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );

        const user = userCredential.user;

        // => to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          results: [],
          createdAt: new Date(),
        });

        // Redirect to user dashboard
        this.$router.push('/userdashboard');

      } catch (error) {
        console.error("Error registering user:", error);
        // All error cases
        switch (error.code) {
          case 'auth/email-already-in-use':
            this.errorMessage = 'Email already in use';
            break;
          case 'auth/invalid-email':
            this.errorMessage = 'Invalid email';
            break;
          case 'auth/weak-password':
            this.errorMessage = 'Password is too weak';
            break;
          default:
            this.errorMessage = 'An error occurred';
        }
      } finally {
        this.loading = false;
      }
    },

    async loginWithGoogle() {
      // Login with Google
      this.googleLoading = true;
      this.errorMessage = '';
      try {

      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const names = user.displayName?.split(' ') || ['', ''];
        await setDoc(userDocRef, {
        firstName: names[0],
        lastName: names[1] || '',
        email: user.email,
        results: [],
        createdAt: new Date(),
        });
      }
      this.$router.push('/userdashboard');
      } catch (error) {
      console.error("Error logging in with Google:", error);

      // All error cases
      switch (error.code) {
        case 'auth/popup-closed-by-user':
        this.errorMessage = 'Popup closed by user';
        break;
        case 'auth/popup-blocked':
        this.errorMessage = 'Popup blocked';
        break;
        case 'auth/cancelled-popup-request':
        this.errorMessage = 'Popup request cancelled';
        break;
        default:
        this.errorMessage = 'An error occurred';
      }

      } finally {
      this.googleLoading = false;
      }
    },
  },
};


</script>


<style>


</style>
