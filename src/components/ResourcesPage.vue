<template>

    <v-container>
        <v-row
        justify="center"
        >
            <v-col cols="12">
                <v-slide-group
                    v-model="selectedCard"
                    show-arrows
                    id="lesson-cards"
                    class="d-flex flex-row justify-center"
                    center-active
                    @change="updateFocusCard"
                >
                <v-slide-item
                    v-for="(lesson, index) in lessons"
                    :key="lesson.id"
                    >

                    <!-- Card layout -->

                        <v-card :elevation="index === selectedCard ? 12 : 2" id="lesson-card" class="mx-4" max-width="344">

                            <v-card-text>
                                <div>
                                    Lesson
                                </div>
                                <p class="text-h4 font-weight-black">
                                    {{ lesson.title }}
                                </p>

                                <div class="text-medium-emphasis">
                                    {{ lesson.content }}
                                </div>
                            </v-card-text>



                            <v-card-actions>
                                <v-btn
                                @click="toggleReveal(lesson.id)"
                                color="teal-accent-4"
                                variant="text"
                                >
                                    Learn more :)
                                </v-btn>
                            </v-card-actions>

                            <v-expand-transition>
                <v-card
                  v-if="revealedCards.has(lesson.id)"
                  class="v-card--reveal"
                  height="100%"
                  style="height: 100%; position: absolute; bottom: 0; left: 0; right: 0; background-color: white;"
                >
                  <v-card-text class="pb-0">
                    <p class="text-h4">Additional Details</p>
                    <p class="text-medium-emphasis">
                      {{ lesson.details }}
                    </p>
                  </v-card-text>

                  <v-card-actions class="pt-0">
                    <v-btn
                      color="teal-accent-4"
                      variant="text"
                      @click="toggleReveal(lesson.id)"
                    >
                    Close
                </v-btn>
                  </v-card-actions>
                </v-card>
              </v-expand-transition>
                        </v-card>
                    </v-slide-item>
                </v-slide-group>
            </v-col>
        </v-row>
    </v-container>

</template>

<script>

import { db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default {
    data() {
        return {
            lessons: [],
            selectedCard: null,
            revealedCards: new Set(),
        };
    },

    mounted() {
        this.fetchLessons();
    },

    methods: {
        async fetchLessons() {
            this.loading = true;
            this.error = null;

        try {
            const querySnapshot = await getDocs(collection(db, 'lessons'));
            this.lessons = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                details: doc.data().details || 'No additional details available', // Ensure details has a default value
            }));
        } catch (error) {
            console.error('Error fetching lessons:', error);
            this.error = error.message;
        } finally {
            this.loading = false;
        }

    },

        toggleReveal(id) {
            // using set to keep track of revealed cards
            if (this.revealedCards.has(id)) {
                this.revealedCards.delete(id);
            } else {
                this.revealedCards.add(id);
            }
        },
        isRevealed(id) {
            return this.revealedCards.has(id);
        },
        updateFocusCard(index) {
            // Ensures that the index is within the bounds of the lessons array
            if (index >= 0 && index < this.lessons.length) {
                this.selectedCard = index;
        }
    }
}
}


</script>

<style>

.lesson-cards {
  display: flex;
  overflow-x: scroll;
  flex-direction: row;
  scroll-snap-type: mandatory;
  scroll-snap-align: start;
    flex: 0 0 auto;
    margin: 0 10px;
}
.main-card {
  opacity: 1;
}

.lesson-card {
    width: 300px;
    margin: 0 10px;
    scroll-snap-align: start;
}

.v-container {
    display: flex;
    justify-content: center;
    overflow-x: auto;
}

</style>
