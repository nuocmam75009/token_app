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
                    class="d-flex flex-row justify-"
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
                                <p class="test-h4 font-weight-black">
                                    {{ lesson.title }}
                                </p>

                                <div class="text-medium-emphasis">
                                    {{ lesson.content }}
                                </div>
                            </v-card-text>



                            <v-card-actions>
                                <v-btn
                                @click="toggleReveal(lesson.extra_content)"
                                color="teal-accent-4"
                                text="Learn More"
                                variant="text"
                                >
                                    {{ lesson.content_1 }}
                                </v-btn>
                            </v-card-actions>

                            <v-expand-transition>
                <v-card
                  v-if="isRevealed(lesson.id)"
                  class="position-absolute w-100"
                  height="100%"
                  style="bottom: 0"
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
                      text="Close"
                      variant="text"
                      @click="toggleReveal(lesson.id)"
                    ></v-btn>
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
            selectedCard: 0,
            revealedCards: {},
        };
    },

    mounted() {
        this.fetchLessons();
    },

    methods: {
        async fetchLessons() {
            try  {
            const querySnapshot = await getDocs(collection(db, 'lessons'));


            this.lessons = querySnapshot.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title,
                skillset: doc.data().skillset,
                content: doc.data().content,
                details: doc.data().details | "",
            }));
            console.log(this.lessons); // debug
        } catch (error) {
            console.error('Error fetching lessons: ', error);
        }
    },

        toggleReveal(id) {
            this.$set(this.revealedCards, id, !this.revealedCards[id]);
        },
        isRevealed(id) {
            return !!this.revealedCards[id];
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
