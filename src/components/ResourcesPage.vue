<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="10" md="8" lg="6">
                <!-- Main Card Container -->
                <v-card elevation="3" class="pa-4">
                    <!-- Search Bar -->
                    <v-row justify="center">
                        <v-col cols="12">
                            <v-text-field
                                v-model="searchQuery"
                                label="Search lessons by keyword"
                                append-icon="mdi-magnify"
                                clearable
                                class="mb-4"
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <!-- Lessons Slide Group -->
                    <v-slide-group
                        v-model="selectedCard"
                        show-arrows
                        class="d-flex flex-row justify-center"
                        center-active
                        @change="updateFocusCard"
                    >
                        <v-slide-item
                            v-for="(lesson, index) in filteredLessons"
                            :key="lesson.id"
                        >
                            <!-- Card Layout for Each Lesson -->
                            <v-card
                                :elevation="index === selectedCard ? 10 : 2"
                                class="lesson-card mx-2 my-4"
                                max-width="300"
                                height="400px"
                                @mouseover="cardHover = true"
                                @mouseleave="cardHover = false"
                                :style="cardHover ? { boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' } : {}"
                            >
                                <v-card-text>
                                    <h4 class="text-h6 font-weight-medium mb-2">{{ lesson.title }}</h4>
                                    <div class="text-body-2 mb-3">
                                        {{ lesson.content }}
                                    </div>
                                </v-card-text>

                                <!-- Card Actions -->
                                <v-card-actions class="d-flex justify-center">
                                    <v-btn
                                        @click="toggleReveal(lesson.id)"
                                        color="primary"
                                        variant="text"
                                    >
                                        Details
                                    </v-btn>
                                </v-card-actions>

                                <!-- Revealed Extra Content -->
                                <v-fade-transition>
                                    <v-card
                                        v-if="revealedCards.has(lesson.id)"
                                        class="v-card--reveal pa-4"
                                    >
                                        <v-card-text>
                                            <p class="text-subtitle-1 font-weight-medium mb-2">Questions to Consider</p>
                                            <p
                                                v-for="(extra, i) in (lesson.extra || [])"
                                                :key="i"
                                                class="text-body-2 mb-1"
                                            >
                                                {{ extra }}
                                            </p>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-btn
                                                color="primary"
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

                    <!-- Infinite Scroll Loading Indicator -->
<!--                     <v-row justify="center" class="mt-4">
                        <v-col cols="auto">
                            <v-infinite-scroll @load="fetchLessons" :disabled="loading || !hasMoreLessons">
                                <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
                            </v-infinite-scroll>
                        </v-col>
                    </v-row> -->
                </v-card>
            </v-col>
        </v-row>
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
            searchQuery: '', // New data property for search input
        };
    },

    computed: {
        // Computed property to filter lessons based on the search query
        filteredLessons() {
            if (!this.searchQuery) {
                return this.lessons;
            }
            const query = this.searchQuery.toLowerCase();
            return this.lessons.filter(
                (lesson) =>
                    lesson.title.toLowerCase().includes(query) ||
                    lesson.content.toLowerCase().includes(query)
            );
        },
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
/* Main container styling */
.resources-page {
    padding: 1rem;
    display: flex;
    justify-content: center;
}

/* Lesson container styling */
.lesson-container {
    display: grid;
    gap: 1rem;
    padding: 0 1rem;
    max-width: 800px; /* Narrower width for the main container */
    margin: auto;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

/* Lesson cards styling */
.lesson-cards {
    display: flex;
    overflow-x: auto;
    scroll-behavior: smooth;
}

.lesson-cards:hover {
    background-attachment: fixed;
}

/* Loading and error message styling */
.loading,
.error {
    text-align: center;
    padding: 2rem;
}

.error {
    color: red;
}

/* Main card styling */
.main-card {
    opacity: 1;
}

/* Individual lesson card styling */
.lesson-card {
    width: 280px;
    padding: 1rem;
    border-radius: 8px;
    margin: 0 8px;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.lesson-card:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-30px);
}

.lesson-card.focused {
    border-color: #42b983;
    box-shadow: 0 0 10px rgba(66, 185, 131, 0.5);
}

/* Styling for the revealed card */
.v-card--reveal {
    transition: transform 4s ease, opacity 0.3s ease;
    transform: rotateY(0deg);
    background-color: #f9f9f9;
    padding: 1rem;
}

.v-card--reveal-enter-active,
.v-card--reveal-leave-active {
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}

.v-card--reveal-enter,
.v-card--reveal-leave-to {
    opacity: 0;
    transform: rotateY(90deg);
}

/* Container alignment and max-width */
.v-container {
    display: flex;
    justify-content: center;
    width: 800px; /* Narrower overall container width */
    margin: auto;
}
</style>
