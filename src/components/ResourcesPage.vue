<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12">
                <v-data-iterator
                    :items="lessons"
                    :items-per-page="itemsPerPage"
                    :page="page"
                    :search="search"
                    :sort-by="sortBy"
                    :sort-desc="sortDesc"
                >
                    <template v-slot:header>
                        <v-toolbar flat>
                            <v-text-field
                                v-model="search"
                                clearable
                                flat
                                hide-details
                                prepend-inner-icon="mdi-magnify"
                                label="search"
                            ></v-text-field>
                            <v-spacer></v-spacer>
                            <v-select
                                v-model="sortBy"
                                flat
                                hide-details
                                :items="sortByItems"
                                prepend-inner-icon="mdi-sort"
                                label="Sort by"
                            ></v-select>
                            <v-btn-toggle v-model="sortDesc">
                                <v-btn :value="false" icon="mdi-arrow-up"></v-btn>
                                <v-btn :value="true" icon="mdi-arrow-down"></v-btn>
                            </v-btn-toggle>
                        </v-toolbar>
                    </template>

                    <template v-slot:default="{ items }">
                        <v-row>
                            <v-col
                                v-for="(lesson, index) in items"
                                :key="lesson.id"
                                cols="12"
                                sm="6"
                                md="4"
                                lg="3"
                            >
                                <v-card
                                    :elevation="selectedCard === index ? 12 : 2"
                                    @click="updateFocusCard(index)"
                                    class="mx-2 my-2"
                                >
                                    <v-card-title>{{ lesson.title }}</v-card-title>

                                    <v-card-text>
                                        <div v-if="isRevealed(lesson.id)">
                                            {{ lesson.details }}
                                        </div>
                                        <div v-else>
                                            Click to reveal details
                                        </div>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-btn
                                            @click.stop="toggleReveal(lesson.id)"
                                            color="primary"
                                        >
                                            {{ isRevealed(lesson.id) ? 'Hide' : 'Show' }} Details
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                    </template>

                    <template v-slot:footer>
                        <v-toolbar flat>
                            <v-select
                                v-model="lessonsPerPage"
                                flat
                                hide-details
                                :items="[4, 8, 12, 16]"
                                label="Lessons per page"
                            ></v-select>
                            <v-spacer></v-spacer>
                            <v-pagination
                                v-model="page"
                                :length="Math.ceil(lessons.length / lessonsPerPage)"
                                :total-visible="7"
                            ></v-pagination>
                        </v-toolbar>
                    </template>
                </v-data-iterator>
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
            focusedCardIndex: -1,
            selectedCard: null,
            revealedCards: new Set(),
            page: 1,
            lessonsPerPage: 8,
            search: '',
            sortBy: 'title',
            sortDesc: false,
            sortByItems: [
                { text:'Title', value: 'title' },
                { text:'Date', value: 'date' },
            ]
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
                this.focusedCardIndex = index;
    }
}
}


</script>

<style>

</style>
