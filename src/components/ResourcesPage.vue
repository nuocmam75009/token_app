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
                            class="lesson-card mx-4 my-2"
                            max-width="344"
                            height="586px"
                            @mouseover="cardHover = true"
                            @mouseleave="cardHover = false"
                            :style="cardHover ? { boxShadow: '0 15px 30px rgba(66, 185, 131, 0.5)' } : {}"
                        >
                            <v-card-text>
                                <h4 class="text-h5 font-weight-bold mb-2">{{ lesson.title }}</h4>
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
                            <!-- Revealed content -->
                            <v-fade-transition>
                                <v-card
                                    v-if="revealedCards.has(lesson.id)"
                                    class="v-card--reveal"
                                    height="100%"
                                >
                                    <v-card-text class="pb-0">
                                        <p class="text-h5 font-weight-bold">Questions you should be able to answer</p>
                                        <p v-for="(extra, i) in (lesson.extra || [])" :key="i" class="text-medium-emphasis text-body-1">
                                            {{ extra }}
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
        <!-- Infinite Scroll -->
        <v-infinite-scroll
            @load="fetchLessons"
            :disabled="loading || !hasMoreLessons"
        >
            <v-progress-circular
                v-if="loading"
                indeterminate
                color="teal"
            ></v-progress-circular>
        </v-infinite-scroll>
    </v-container>
</template>


<script>
import { db } from '../../config/firebase';
import { collection, getDocs, query, limit, orderBy, startAfter } from 'firebase/firestore';

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
            lastVisible: null,
            hasMoreLessons: true,
        };
    },

    mounted() {
        this.fetchLessons(); // Initial load of lessons
    },

    methods: {
        async fetchLessons() {
            if (this.loading || !this.hasMoreLessons) return;

            this.loading = true;
            this.error = null;

            try {
                // Define the query to fetch lessons with pagination
                const lessonsRef = collection(db, 'lessons');
                let lessonsQuery = query(lessonsRef, orderBy('title'), limit(10));

                // Start after the last visible document if available
                if (this.lastVisible) {
                    lessonsQuery = query(lessonsRef, orderBy('title'), startAfter(this.lastVisible), limit(10));
                }

                const querySnapshot = await getDocs(lessonsQuery);

                if (!querySnapshot.empty) {
                    // Update lessons and set the last visible document
                    const newLessons = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        details: doc.data().details || 'No additional details available',
                    }));

                    this.lessons = this.lessons.concat(newLessons);
                    this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]; // Track last document
                } else {
                    this.hasMoreLessons = false; // No more lessons to load
                }
            } catch (error) {
                console.error('Error fetching lessons:', error);
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },

        toggleReveal(id) {
            if (!id) return;

            if (this.revealedCards.has(id)) {
                this.revealedCards.delete(id);
            } else {
                this.revealedCards.add(id);
            }
        },

        updateFocusCard(index) {
            if (index < 0 || index >= this.lessons.length) return;
            this.focusedCardIndex = index;
        }
    },
};
</script>


<style scoped>
.resources-page {
    padding: 1rem;
}

.lesson-container {
    display: grid;
    gap: 1rem;
    padding: 0 1rem;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) ;
}


.lesson-cards {
  display: flex;
  cursor: pointer;
  overflow-x: hidden;
}
.lesson-cards:hover {
    overflow-x: auto;
    background: fixed;
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
    border-radius: 4px;
    margin: 0 10px;

}

.v-container {
    display: flex;
    justify-content: center;
    max-width: 100%;
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
