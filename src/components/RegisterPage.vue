<template>
    <v-container>
        <v-sheet class="mx-auto" width="300">
      <v-form @submit.prevent="registerUser">
        <v-text-field v-model="email" label="Email" required></v-text-field>
        <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
        <v-text-field v-model="firstName" label="First Name" required></v-text-field>
        <v-text-field v-model="lastName" label="Last Name" required></v-text-field>
        <v-btn type="submit" width="300" color="blue">Register</v-btn>
      </v-form>
    </v-sheet>
    </v-container>
  </template>


<script>

import { auth, db } from "../../config/firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

export default {
  data() {
    return {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
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
  },
};
</script>


<style>


</style>
