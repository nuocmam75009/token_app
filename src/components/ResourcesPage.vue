<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
                <v-card elevation="3" class="pa-4">
                    <v-row justify="center" no-gutters>
                        <v-col cols="10" sm="6" md="5">
                            <v-text-field
                                v-model="searchQuery"
                                label="Search by keyword"
                                append-icon="mdi-magnify"
                                clearable
                                dense
                                class="mb-4"
                            >
                        </v-text-field>
                        </v-col>
                        <v-col cols="2" class="d-flex justify-center">
                            <v-btn
                                :color="showSavedOnly ? 'primary' : 'grey'"
                                @click="toggleShowSavedOnly"
                                class="mx-1"
                                dense
                            >
                                Saved Lessons
                            </v-btn>
                            <v-btn
                            @click="goToAddLessonPage"
                            color="primary">
                                Add a Lesson
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-slide-group
                        v-model="selectedCard"
                        show-arrows
                        class="d-flex mt-4 justify-center"
                        center-active
                        @change="updateFocusCard"
                    >
                        <v-slide-item
                            v-for="(lesson, index) in filteredLessons"
                            :key="lesson.id"
                        >
                            <v-card
                                :elevation="index === selectedCard ? 10 : 2"
                                class="lesson-card mx-2 my-4"
                                max-width="280"
                                height="400px"
                                style="overflow: hidden"
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
                                <v-card-actions class="button-container d-flex flex-column">
                                    <v-btn
                                        @click="toggleReveal(lesson.id)"
                                        color="primary"
                                        dense
                                        variant="text"
                                        class="small-btn"
                                    >
                                        Details
                                    </v-btn>
                                    <v-btn
                                        :color="savedLessons.includes(lesson.id) ? 'red' : 'green'"
                                        @click="toggleSaveLesson(lesson.id)"
                                        variant="text"
                                        class="small-btn mt-1"
                                    >
                                        {{ savedLessons.includes(lesson.id) ? 'Unsave' : 'Save' }}
                                    </v-btn>
                                </v-card-actions>
                                <v-fade-transition>
                                    <v-card
                                        v-if="revealedCards.has(lesson.id)"
                                        class="v-card--reveal pa-4"
                                    >
                                        <v-card-text>
                                            <p class="text-subtitle-1 font-weight-medium mb-2">Interview questions</p>
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
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { db } from '../../config/firebase';
import { collection, getDocs, query, limit, orderBy, startAfter } from 'firebase/firestore';
import { useRouter } from 'vue-router';

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
            searchQuery: '',
            savedLessons: [],
            showSavedOnly: false,
        };
    },

    computed: {
        filteredLessons() {
            let filtered = this.lessons;


            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(
                    (lesson) =>
                        lesson.title.toLowerCase().includes(query) ||
                        lesson.content.toLowerCase().includes(query)
                );
            }
            if (this.showSavedOnly) {
                filtered = filtered.filter(lesson => this.savedLessons.includes(lesson.id));
            }

            return filtered;
        },
    },

    mounted() {
        this.fetchLessons();
    },

    methods: {
        async fetchLessons() {
            if (this.loading || !this.hasMoreLessons) return;

            this.loading = true;
            this.error = null;

            try {

                const lessonsRef = collection(db, 'lessons');
                let lessonsQuery = query(lessonsRef, orderBy('title'), limit(10));

                if (this.lastVisible) {
                    lessonsQuery = query(lessonsRef, orderBy('title'), startAfter(this.lastVisible), limit(10));
                }

                const querySnapshot = await getDocs(lessonsQuery);

                if (!querySnapshot.empty) {

                    const newLessons = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        details: doc.data().details || 'No additional details available',
                    }));

                    this.lessons = this.lessons.concat(newLessons);
                    this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]; // Track last document
                } else {
                    this.hasMoreLessons = false;
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
        },

        toggleSaveLesson(id) {
            if (this.savedLessons.includes(id)) {
                this.savedLessons = this.savedLessons.filter(lessonId => lessonId !== id);
            } else {
                this.savedLessons.push(id);
            }
        },

        toggleShowSavedOnly() {
            this.showSavedOnly = !this.showSavedOnly;
        }
    },
    setup() {
    const router = useRouter();

    // Navigate to AddLessonPage
    const goToAddLessonPage = () => {
      router.push({ path: '/newlesson' });
    };

    return {
      goToAddLessonPage,
    };
  },
};
</script>


<style scoped>
.resources-page {
    padding: 1rem;
    display: flex;
    justify-content: center;
    width: auto;
}

.lesson-cards {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 24px;
    gap: 16px;
    padding: 16px;
    overflow-x: auto;
    scroll-behavior: smooth;
    min-height: 400px;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.lesson-cards:hover {
    background-attachment: fixed;
}

.lesson-card {
    max-width: 300px;
    position: relative;
    width: 100%;
    padding: 16px;
    border-radius: 8px;
    margin: 8px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}


.lesson-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transform: translateY(-20px);
    background-color: rgba(240, 230, 226, 0.8);
}


.v-card--reveal {
    background-color: rgba(240, 230, 235, 0.8);
    padding: 16px;
    transform-origin: center;
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.v-card--reveal-enter-active,
.v-card--reveal-leave-active {
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
    transform: rotateY('angle')
}

.v-card--reveal-enter,
.v-card--reveal-leave-to {
    opacity: 0;
    transform: rotateY(90deg);
}

.v-container {
    display: flex;
    justify-content: center;
    width: 800px;
    margin: auto;
}
.small-btn {
    min-width: 10px;
    padding: 0 4px;
    font-size: 0.75rem;
    text-transform: none;

}

.small-btn-container {
    display: flex;
    justify-content: center;
    gap: -1px;
}

.navigation-arrow {
    font-size: 24px;
    opacity: 0.6;
}

.lesson-cards:only-child .navigation-arrow {
    display: none; /* Hide arrows if there's only one card */
}
.justify-space-between {
    justify-content: space-between;
}

</style>
