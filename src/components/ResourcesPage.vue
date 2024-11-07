<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
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
                        <v-card
                            :elevation="index === selectedCard ? 12 : 2"
                            id="lesson-card"
                            class="mx-4 my-2"
                            max-width="344"
                            height="auto"
                            @mouseover="cardHover = true"
                            @mouseleave="cardHover = false"
                            :style="{ boxShadow: '0 10 20px rgba(66, 185, 131, 0.4)' }"
                        >
                            <v-card-text>
                                <h4 class="text-h5 font-weight-black mb-2">
                                    {{ lesson.title }}
                                </h4>
                                <div class="text-medium-emphasis mb-3">
                                    {{ lesson.content }}
                                </div>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn
                                    @click="toggleReveal(lesson.id)"
                                    color="teal-accent-4"
                                    variant="text"
                                >
                                    Click here!
                                </v-btn>
                            </v-card-actions>

                            <v-fade-transition>
                                <v-card
                                    v-if="revealedCards.has(lesson.id)"
                                    class="v-card--reveal"
                                    height="100%"
                                >
                                    <v-card-text class="pb-0">
                                        <p class="text-h5 font-weight-bold">Questions you should be able to answer</p>
                                        <p class="text-medium-emphasis text-body-1" v-if="lesson?.extra && lesson?.extra.length > 0">
                                            {{ lesson.extra[0] }}
                                        </p>
                                        <p class="text-medium-emphasis text-body-1" v-if="lesson?.extra && lesson?.extra.length > 0">
                                            {{ lesson.extra[1] }}
                                        </p>
                                        <p class="text-medium-emphasis text-body-1" v-if="lesson?.extra && lesson?.extra.length > 0">
                                            {{ lesson.extra[2] }}
                                        </p>
                                    </v-card-text>
                                    <v-card-actions class="pt-0">
                                        <v-btn
                                            color="teal-accent-4"
                                            variant="outlined"
                                            @click="toggleReveal(lesson.id)"
                                        >
                                            Close
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-fade-transition>
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
    name: 'ResourcesPage',
    data() {
        return {
            lessons: [],
            loading: false,
            error: null,
            cardHover: false,
            focusedCardIndex: -1,
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
            if (!id) return;

            // using set to keep track of revealed cards
            if (this.revealedCards.has(id)) {
                this.revealedCards.delete(id);
            } else {
                this.revealedCards.add(id);
            }
        },
        isRevealed(id) {
            return id && this.revealedCards.has(id);
        },
        updateFocusCard(index) {
            // Ensures that the index is within the bounds of the lessons array
            if (index < 0 || index >= this.lessons.length) return;
                this.focusedCard.index = index;
    }
}
}


</script>

<style>
.resources-page {
    padding: 1rem;
}

.lesson-container {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) ;
}

.lesson-cards {
  display: flex;
  overflow-x: scroll;
  flex-direction: row;
  scroll-snap-type: mandatory;
  scroll-snap-align: start;
    flex: 0 0 auto;
    margin: 0 10px;
}

.loading, .error {
    text-align: center;
    padding: 2rem;
}

.main-card {
  opacity: 1;
}

.lesson-card {
    width: 300px;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin: 0 10px;
    scroll-snap-align: start;
}

.v-container {
    display: flex;
    justify-content: center;
    overflow-x: auto;
}

.error {
    color: red;
}

.lesson-card.focused {
    border-color: #42b983;
    box-shadow: 0 0 8px rgba(66, 185, 131, 0.4);
}

.v-card--reveal {
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform: rotateY(0deg);
}

.v-card--reveal-enter-active,
.v-card--reveal-leave-active {
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}

.v-card--reveal-enter, .v-card--reveal-leave-to {
  opacity: 0;
  transform: rotateY(90deg);
}
</style>
