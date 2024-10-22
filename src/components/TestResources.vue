<template>

    <v-container>
        <v-row>
            <v-col cols="12">
                <v-slide-group
                    v-model="selectedCard"
                    show-arrows
                    class="lesson-cards"
                    center-active
                    @change="updateFocusCard"
                >
                    <v-slide-item
                        v-for="(lesson, index) in lessons"
                        :key="lesson.id"
                        :class="{
                            'main-card': index === selectedCard,
                            'neighbour-card': Math.abs(selectedCard - index) === 1
                        }"
                    >
                        <v-card :elevation="index === selectedCard ? 12 : 2" class="lesson-card">
                            <v-card-title>
                                {{ lesson.title }}
                            </v-card-title>

                            <v-card-subtitle>
                                {{ lesson.skillset }}
                            </v-card-subtitle>

                            <v-card-text>
                                {{ lesson.content }}
                            </v-card-text>

                            <v-card-actions>
                                <v-btn @click="toggleReveal(lesson.id)">
                                    {{ lesson.content_1 }}
                                </v-btn>
                            </v-card-actions>

                            <v-expand-transition>
                                <div v-if="isRevealed(lesson.id)">
                                    <v-card-text>
                                        {{ lesson.details }}
                                    </v-card-text>
                                </div>
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
                content: doc.data().content
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
  transition: opacity 0.3s ease;
}
.neighbour-card {
  opacity: 0.5;
  transition: opacity 0.3s ease;
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
