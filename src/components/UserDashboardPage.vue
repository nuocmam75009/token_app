<template>
    <v-container>
      <v-row>
        <v-col cols="12" md="8" lg="6">
          <v-hover v-slot="{ isHovering, props }" open-delay="100">
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
                    <p><strong>Email:</strong> {{ emailAddress }}</p>
                  </v-col>
                  <v-btn
                    color="blue"
                    @click="editDialog = true"
                    prepend-icon="mdi-account-edit"
                    class="text-none font-weight-regular"
                  >Edit Your Info</v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-col>

        <!-- Section to review the last quiz -->
        <v-col cols="12" md="8" lg="6">
          <v-hover v-slot="{ isHovering, props }" open-delay="100">
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
                <p><strong>Date: </strong>{{ formatDate(latestQuiz.date) }}</p>
                <p><strong>Mode: </strong> {{ latestQuiz.mode }}</p>
                <p><strong>Score:</strong> {{ latestQuiz.score }}%</p>
                <p><strong>Details: </strong>{{ latestQuiz.results }}</p>
                <v-btn
                  color="blue"
                  prepend-icon="mdi-information"
                  class="text-none font-weight-regular"
                  @click="detailsDialog = true"
                >Show details</v-btn>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-col>

        <!-- Edit Information Modal -->
        <v-dialog v-model="editDialog">
          <v-card>
            <v-card-title prepend-icon="mdi-account">Edit My Information</v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field
                    v-model="editedProfile.firstName"
                    label="First Name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field
                    v-model="editedProfile.lastName"
                    label="Last Name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-text-field
                    v-model="editedProfile.email"
                    label="Email Address"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn prepend-icon="mdi-content-save" color="blue" @click="saveProfile">Save</v-btn>
              <v-btn color="red" prepend-icon="mdi-account-cancel" @click="editDialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Quiz Details Modal -->
        <v-dialog v-model="detailsDialog" max-width="800px">
          <v-card>
            <v-card-title>Progression</v-card-title>
            <v-card-text>
              <p><strong>Quiz Title:</strong> {{ latestQuiz.title || 'N/A' }}</p>
              <p><strong>Score:</strong> {{ latestQuiz.score }}%</p>
              <p>INSERT GRAPH OF VALID ANSWERS % EVOLUTION</p>
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
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'UserDashboard',
  data() {
    return {
      editDialog: false,
      detailsDialog: false,
      results: [],
      firstName: '',
      lastName: '',
      emailAddress: '',
      editedProfile: {
        firstName: '',
        lastName: '',
        email: '',
      },
      latestQuiz: {},
    };
  },
  async created() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Current user UID:", user.uid);

        // Fetching user details
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          this.firstName = userData.firstName;
          this.lastName = userData.lastName;
          this.emailAddress = userData.email;
          this.editedProfile = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.emailAddress,
          };
          this.results = userData.results || [];

          // Log path and attempt to fetch latest quiz result
          console.log(`Attempting to fetch quiz results from path: quizzResults/${user.uid}/results`);

          try {
            const resultsCollectionRef = collection(db, 'quizzResults', user.uid, 'results');
            const resultsQuery = query(resultsCollectionRef, orderBy('date', 'desc'), limit(1));
            
            const querySnapshot = await getDocs(resultsQuery);

            // Check if documents exist and log each one
            if (!querySnapshot.empty) {
              querySnapshot.forEach((doc) => {
                console.log('Fetched latest quiz result data:', doc.data());
                this.latestQuiz = doc.data();
              });
            } else {
              console.warn('No quiz results found for this user.');
              this.latestQuiz = {
                date: null,
                mode: 'N/A',
                score: 'N/A',
                results: 'N/A',
              };
            }
          } catch (error) {
            console.error('Error fetching quiz results:', error);
          }
        } else {
          console.warn('No user data found in Firestore.');
        }
      } else {
        console.warn('No user is signed in.');
      }
    });
  },
  methods: {
    formatDate(date) {
      return date ? new Date(date.seconds * 1000).toLocaleString() : 'N/A';
    },
  },
};

</script>



<style>
</style>