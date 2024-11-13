<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="8" sm="6" md="5" lg="6">
                <v-card elevation="3" class="pa-4">
                    <v-card-title>Add a New Lesson</v-card-title>
                    <v-card-text>
                        <v-text-field
                            v-model="newLesson.title"
                            label="Lesson Title"
                            required
                        ></v-text-field>
                        <v-textarea
                            v-model="newLesson.content"
                            label="Lesson Content"
                            required
                        ></v-textarea>
                        <v-select
                            v-model="newLesson.skillset"
                            :items="skillsetOptions"
                            label="Skillset"
                            required
                            @change="checkCustomSkillset"
                        ></v-select>

                        <v-text-field
                            v-if="newLesson.skillset === 'Other'"
                            v-model="customSkillset"
                            label="Enter custom skillset"
                            @input="newLesson.skillset = customSkillset"
                        ></v-text-field>

                        <v-textarea
                            v-model="newLesson.extra"
                            label="Additional Info (Interview Questions)"
                            placeholder="Add any extra interview questions here"
                        ></v-textarea>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="blue darken-1" text @click="submitNewLesson">
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import { getFirestore, collection, addDoc, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";

export default {
    data() {
        return {
            newLesson: {
                title: '',
                content: '',
                skillset: '',
                extra: ''
            },
            skillsetOptions: [],
            customSkillset: ''
        };
    },
    async mounted() {
        await this.fetchSkillsets();
    },
    methods: {
        async fetchSkillsets() {
            const db = getFirestore();
            const skillsetDocRef = doc(db, "skillsets", "skillset");

            try {
                const skillsetDoc = await getDoc(skillsetDocRef);
                if (skillsetDoc.exists()) {
                    this.skillsetOptions = skillsetDoc.data().skills;
                    this.skillsetOptions.push("Other");
                } else {
                    console.error("Skillset document does not exist!");
                }
            } catch (error) {
                console.error("Error fetching skillsets:", error);
            }
        },
        async submitNewLesson() {
            if (!this.newLesson.content.trim()) {
            console.error("Lesson content cannot be empty.");
            return;
            }

            try {
            const db = getFirestore();
            const lessonsCollection = collection(db, "lessons");

            if (this.newLesson.skillset === "Other" && this.customSkillset) {
                await this.addCustomSkillset(db, this.customSkillset);

                this.newLesson.skillset = this.customSkillset;
            }

            await addDoc(lessonsCollection, {
                title: this.newLesson.title,
                content: this.newLesson.content,
                skillset: this.newLesson.skillset,
                extra: this.newLesson.extra ? this.newLesson.extra.split('\n') : []
            });

            this.resetForm();

            this.$router.push({ name: 'LessonList' });
            } catch (error) {
            console.error("Error adding lesson:", error);
            }
        },

        async addCustomSkillset(db, skillset) {
            const skillsetDocRef = doc(db, "skillsets", "skillset"); // Document ID should be correct here
            try {
                // Update the "skills" array with the new skillset
                await updateDoc(skillsetDocRef, {
                    skills: arrayUnion(skillset)
                });
                // Also add it locally to skillsetOptions so it shows up immediately
                this.skillsetOptions.push(skillset);
            } catch (error) {
                console.error("Error adding new skillset:", error);
            }
        },

        resetForm() {
            this.newLesson = {
                title: '',
                content: '',
                skillset: '',
                extra: ''
            };
            this.customSkillset = '';
        },

        checkCustomSkillset() {
            // If the user selects "Other", clear customSkillset to allow input
            if (this.newLesson.skillset === "Other") {
                this.customSkillset = '';
            }
        },

        goBack() {
            this.$router.back();
        }
    }
};

</script>

<style scoped>

</style>
