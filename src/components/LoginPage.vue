<template>
    <v-container>
        <v-sheet class="mx-auto grey lighten-3" width="500">
            <v-card class="mx-auto px-6 py-8" max-width="auto">
                <v-form v-model="form" @submit.prevent="loginUser">
                    <v-text-field v-model="email" label="Email" required :rules="emailRules"></v-text-field>
                    <v-text-field v-model="password" label="Password" type="password" required :rules="passwordRules"></v-text-field>
                    <br />
                    <br />
                    <v-btn prepend-icon="mdi-account" :loading="loading" type="submit" color="blue" class="my-2">Log in</v-btn>
                    <v-btn prepend-icon="mdi-account" :loading="googleLoading" @click="loginWithGoogle" class="my-2" color="blue">Log in with your Google account</v-btn>
                    <v-alert v-if="errorMessage" type="error" class="mt-4">{{ errorMessage }}</v-alert>
                </v-form>
            </v-card>
        </v-sheet>
    </v-container>
</template>

<script>
import { auth, db } from "../../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default {
    name: 'LoginPage',
    data() {
        return {
                email: "",
                password: "",
                results: [],
                googleLoading: false,
                form: false,
                errorMessage: '',


                // Rules for validation
                emailRules: [
                    v => !!v || 'E-mail is required',
                    v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                ],
                passwordRules: [
                    v => !!v || 'Password is required',
                    v => v.length >= 6 || 'Password must be at least 6 characters',
                ],
        }
    },
    methods: {
        async loginUser() {
            try {
                // Sign in with email and password
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    this.input.email,
                    this.input.password
                );

                const user = userCredential.user;
                // Check if user exists in Firestore
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    this.errorMessage = "User does not exist";
                } else {
                    this.$router.push('/userdashboard');
                }
            } catch (error) {
                console.error("Error signing in with email and password:", error);
                // Different errors
                switch (error.code) {
                    case "auth/user-not-found":
                        this.errorMessage = "User not found. Please create an account";
                        break;
                    case "auth/wrong-password":
                        this.errorMessage = "Wrong password";
                        break;
                    case "auth/invalid-email":
                        this.errorMessage = "Invalid email";
                        break;
                    default:
                        this.errorMessage = "An error occured. Please try again";
                }
            }
        },

        async loginWithGoogle() {
            try {
                this.googleLoading = true;
                this.errorMessage = "";

                const googleProvider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;

                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                // Create new instance in Firestore if user does not exist
                if (!userDoc.exists()) {
                    const names = user.displayName?.split(' ') || ['', ''];
                    await setDoc(userDocRef, {
                        firstName: names[0],
                        lastName: names[1],
                        email: user.email,
                        results: [],
                        createdAt: new Date(),
                    });
                }
                this.$router.push('/userdashboard');
            } catch (error) {
                console.error("Error logging in with Google: ", error);
                // Handle different errors
                switch (error.code) {
                    case "auth/popup-closed-by-user":
                        this.errorMessage = "Google popup was closed";
                        break;
                    case "auth/popup-blocked":
                        this.errorMessage = "Popup blocked";
                        break;
                    case "auth/cancelled-popup-request":
                        this.errorMessage = "Popup request cancelled";
                        break;
                    default:
                        this.errorMessage = "An error occured. Please try again";
                }
            } finally {
                this.googleLoading = false;
            }
        },
    },
};
</script>


<style>

.error {
    color: red;
    display: block;
    margin-top: auto;
}

</style>
