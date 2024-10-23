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
                  <p><strong>First Name:</strong> {{  }}</p>
                  <p><strong>Last Name:</strong> {{  }}</p>
                  <p><strong>Email:</strong> {{  }}</p>
                </v-col>
              </v-row>
              <v-btn color="blue" @click="editInfo">Edit Information</v-btn>
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
              <p><strong>Quiz Title:</strong> {{  }}</p>
              <p><strong>Score:</strong> {{  }}%</p>
              <v-btn color="blue" @click="editInfo">Show details</v-btn>
            </v-card-text>
          </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </template>

<script>

import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';


export default {
    name: 'UserDashboard',
    data() {
        return {
            results: [],
            firstName: '',
            lastName: '',
            emailAdress: '',
            loading: true,
        };
    },
    async mounted() {
        try  {
            const user = auth.currentUser;
            if (user) {
                // Get user results from Firestore
                const userResultsDocRef = doc(
                    db,
                    'quizzResults',
                    user.uid
                );
                const docSnap = await getDoc(userResultsDocRef);

                if (docSnap.exists()) {
                    // If document exists, access stored results
                    this.results = docSnap.data().results; // access stored results
                } else {
                    console.log('No results found');
                }
            }
        } catch (error) {
            // Handle error
            console.error('Error fetching user results:', error);
        }
    },

    async created() {
        try {

            const userId = "USER_ID";
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
        this.firstName = userData.firstName;
        this.lastName = userData.lastName;
        this.email = userData.email;
        this.results = userData.results || [];
            } else {
                console.log('No user');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            this.loading = false;
        }
    },

    methods: {
        editInfo() {
            this.$router.push('/edit-info');
        }
    }

};


</script>

<style>

</style>