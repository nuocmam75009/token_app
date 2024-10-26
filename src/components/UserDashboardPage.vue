<template>
    <v-container>
      <v-row>
        <v-col cols="12">
            <v-hover
            v-slot="{ isHovering, props }"
            open-delay="100"
            >
                <v-card
                :class="{ 'onHover': isHovering }"
                :elevation="isHovering ? 16 : 2"
                height="350"
                v-bind="props"
                >
                    <v-card-title>
                    <h3>User Dashboard</h3>
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                            <p><strong>First Name:</strong> {{ firstName }}</p>
                            <p><strong>Last Name:</strong> {{ lastName }}</p>
                            <p><strong>Email:</strong> {{ emailAdress }}</p>
                            </v-col>
                            <v-btn
                            color="blue"
                            @click="editDialog = true"
                            prepend-icon="mdi-account-edit"
                            class="text-none-font-weight-regular"
                            >Edit Your Info</v-btn>                        
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-hover>
        </v-col>

        <!-- Section to review the last quiz -->
        <v-col cols="12">
            <v-hover
            v-slot="{ isHovering, props }"
            open-delay="100"
            >
          <v-card
          :class="{ 'onHover': isHovering }"
          :elevation="isHovering ? 16 : 2"
          height="350"
          v-bind="props"
          >
            <v-card-title>
              <h3>Last Quiz</h3>
            </v-card-title>

            <v-card-text>
                <p><strong>Quiz Title:</strong> {{ results[0]?.quizTitle }}</p>
                <p><strong>Score:</strong> {{ results[0]?.score }}%</p>
                <p><strong>debug </strong> {{ this.results }}</p>
                <v-btn
                color="blue"
                prepend-icon="mdi-information"
                class="text-none-font-weight-regular"
                @click="detailsDialog=true">Show details</v-btn>
            </v-card-text>
          </v-card>
          </v-hover>    
        </v-col>

         <!-- Edit Information Modal -->

        <v-dialog v-model="editDialog">
            <v-card prepent-icon="mdi-account" title="Edit My Information">
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" md="4" sm="6">
                            <v-text-field
                            v-model="editedProfile.firstName"
                            label="First Name" required
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                            <v-text-field
                                label="Last Name" required
                                v-model="editedProfile.lastName"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4" sm="6">
                            <v-text-field
                                label="Email Address"
                                required
                                v-model="editedProfile.email"
                            ></v-text-field>
                        </v-col>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <!--Save button -->
                            <v-btn
                            prepend-icon="mdi-content-save"
                            variant="tonal"
                            color="blue"
                            @click="editDialog = false">Save</v-btn>
                            <!-- Cancel button -->
                            <v-btn
                            color="red"
                            variant="plain"
                            prepend-icon="mdi-account-cancel"
                            @click="editDialog = false">Cancel</v-btn>
                        </v-card-actions>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>

    <!-- Quiz Details Modal -->
        <v-dialog v-model="detailsDialog" max-width="800px">
            <v-card>
            <v-card-title>Quiz Details</v-card-title>
            <v-card-text>
                <p><strong>Quiz Title:</strong> {{ results[0]?.quizTitle }}</p>
                <p><strong>Score:</strong> {{ results[0]?.score }}%</p>
                <p>More details about the quiz can be shown here...</p>

                <div v-if="results.length > 0">
                    <ul>
                        <li v-for="(result, index) in results" :key="index">
                            <strong>Question:</strong> {{ result.question }} <br>
                            <strong>Your Answer:</strong> {{ result.selectedAnswer }} <br>
                            <strong>Result:</strong> <span :class="{'correct': result.isCorrect, 'incorrect': !result.isCorrect}">
                                {{ result.isCorrect ? 'Correct' : 'Incorrect' }}
                            </span>
                        </li>
                    </ul>
                </div>


            </v-card-text>
            <v-card-actions>
                <v-btn color="blue" @click="detailsDialog = false">Close</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
      </v-row>
    </v-container>


  </template>

<script>

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

export default {
    name: 'UserDashboard',
    data() {
        return {
            dialog: false,
            editDialog: false,
            detailsDialog: false,
            results: [],
            firstName: '',
            lastName: '',
            emailAdress: '',
            loading: true,
            editedProfile: {
                firstName: '',
                lastName: '',
                email: '',
            },
        };
    },
        async created() {
            onAuthStateChanged(auth, async (user) =>  {
                if (user) {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userSnap = await getDoc(userDocRef);

                    if (userSnap.exists()) {
                    const userData = userSnap.data();
                    this.firstName = userData.firstName;
                    this.lastName = userData.lastName;
                    this.emailAdress = userData.email;
                    this.results = userData.results || [];

                    // Init with edited info

                    this.editedProfile = {
                        firstName:this.firstName,
                        lastName: this.lastName,
                        email: this.emailAdress,
                    };
                    } else {
                        console.log('No such user found in Firestore');
                    }
                } else {
                    console.log('No user is signed in');
                }
            });
        },

    methods: {
        async saveProfile() {
          try {
            const user = auth.currentUser;
            if (user) {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
              // Update the Firestore data
              firstName: this.editedProfile.firstName,
              lastName: this.editedProfile.lastName,
              email: this.editedProfile.email,
            });
            // Update the local data
            this.firstName = this.editedProfile.firstName;
            this.lastName = this.editedProfile.lastName;
            this.emailAdress = this.editedProfile.email;

            // Close dialog
            this.editDialog = false;
            }
          }  catch (error) {
            console.error('Error updating user info:', error);
        }
        }
    },

};

export const createUser = async (
    email,
    password,
    firstName,
    lastName
) => {
    try {
        const userCredential =
        await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // If user is created => add user to Firestore
        await setDoc(doc(db, 'users', user.uid), {
            firstName,
            lastName,
            email,
            results: [],
        });
        console.log('User created');
    } catch (error) {
        console.error('Error creating user:', error);
    }
};


/* const updateUser = async (uid, updatedData) => {
  const userRef = doc(db, 'users', uid);

  try {
    await updateDoc(userRef, updatedData);
    console.log('User information updated successfully');
  } catch (error) {
    console.error('Error updating user info:', error);
  }
};

 */
</script>

<style>

</style>