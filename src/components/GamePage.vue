<template>
    <v-container class="game">
        <v-card class="mb-5" color="primary" dark>
            <v-card-title class="text-wrap">You are now playing in {{ mode }} mode</v-card-title>
        </v-card>

        <v-card v-if="questions.length > 0" class="consistent-card">
            <v-alert v-if="timer > 0" type="info" class="text-h6 text-wrap">
                Time left: {{ timer }} seconds
            </v-alert>
            <v-alert v-else type="error" class="text-h6 text-wrap">
                Time's up!
            </v-alert>

            <v-progress-linear :value="((timer / 15) * 100)" color="blue" height="10" class="mb-4"></v-progress-linear>

            <v-card-title class="text-wrap">{{ currentQuestion.question }}</v-card-title>

            <v-card-text>
                <v-btn
                    v-for="(option, answerIndex) in currentQuestion.options"
                    :key="answerIndex"
                    @click="selectAnswer(answerIndex)"
                    :disabled="timer === 0 || answerSelected"
                    :class="{
                        'selected': answerIndex === selectedAnswer,
                        'disabled': timer === 0
                    }"
                    small
                    color="primary"
                    class="answer-button text-wrap"
                >
                    {{ option }}
                </v-btn>
            </v-card-text>
        </v-card>

        <v-card v-else class="consistent-card">
            <v-card-text class="text-wrap">Loading questions...</v-card-text>
        </v-card>

        <v-card v-if="isFinished" class="mt-5 consistent-card">
            <v-card-title class="text-wrap">Quiz Finished!</v-card-title>
            <v-card-text>
                <router-link :to="{ name: 'UserDashboard', params: { results: results } }">
                    <v-btn color="success" dark>Check your progress!</v-btn>
                </router-link>
            </v-card-text>
        </v-card>
    </v-container>
</template>


<script>

import { ref, onMounted, computed } from 'vue';
import { addDoc, arrayUnion, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';


export default {
    name: 'GamePage',
    props: ['mode'],
    setup(props) {
        const questions = ref([]);
        const timer = ref(15);
        const auth = getAuth();
        let intervalId = null;
        const currentQuestionIndex = ref(0);
        const isFinished = ref(false);
        const results = ref([]);
        const answerSelected = ref(false); //track if answer is selected
        const selectedAnswer = ref(null); //track selected answer's idx
        const correctAnswers = ref(0);

        const fetchQuestions = async () => {
            // Fetch questions from Firestore
            try {
                const collectionName = `${props.mode}_questions`;
                console.log("Fetching questions from collection:", collectionName); // Debugging

                const questionsSnapshot = await getDocs(collection(db, collectionName));
                questions.value = questionsSnapshot.docs.map(doc =>
                doc.data());
                // correctAnswer: doc.data().correctAnswer; /* eslint-disable-line */

            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        const selectAnswer = (optionIndex) => {
            console.log(`Selected answer: ${optionIndex}`);

            const correctIndex = currentQuestion.value.correctAnswer;

            const isCorrect = optionIndex === correctIndex; // cmp selected option with correct option
            console.log(`Selected answer's index: ${optionIndex}, Correct answer: ${correctIndex}, Is Correct: ${isCorrect}`); //debug

            // store results in array
            results.value.push({
                question: currentQuestion.value.question,
                selectedAnswer: currentQuestion.value.options[optionIndex],
                isCorrect: isCorrect,
            });

            answerSelected.value = true;
            selectedAnswer.value = optionIndex;

            if (isCorrect) {
                // Correct answer => increment correctAnswers
                correctAnswers.value++;
            }

            moveToNextQuestion();
        };

        const resetTimer = () => {
            timer.value = 15;
            answerSelected.value = false;
            selectedAnswer.value = null;
            // clear interval to avoid multiple timers running
            if (intervalId) clearInterval(intervalId);

            // countdown for next question
            intervalId = setInterval(() => {
                if (timer.value > 0) {
                    timer.value--;
                } else {
                    moveToNextQuestion(); // add this line so it keeps moving forward as long as time's up
                    clearInterval(intervalId);
                }
            }, 1000);
        };

        const moveToNextQuestion = () => {
            // Move to the next question if there are more questions
            if (currentQuestionIndex.value < questions.value.length - 1) {
                currentQuestionIndex.value++;
                resetTimer();
            }
            else {
                isFinished.value = true;
                clearInterval(intervalId);

                //Store results in Firestore
                storeResultsInFirestore();
                calculatePercentage();
            }
        };

        onMounted(() => {
            fetchQuestions();
            console.log('Selected mode:', props.mode); // Debugging
            intervalId = setInterval(() => {
                // Decrement timer every second
                if (timer.value > 0) {
                    timer.value--;
                } else {
                    clearInterval(intervalId);
                    moveToNextQuestion();
                }
            }, 1000);
        });

        const currentQuestion = computed(() =>
            // Return the current question based on the current index
            questions.value[currentQuestionIndex.value]
        );

        const storeResultsInFirestore = async () => {
            // Store the user's results in Firestore
            try {
                // Check for authenticated user
                onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        // Reference to the user's document in Firestore
                        const resultsCollectionRef = collection(
                            db,
                            'quizzResults',
                            user.uid,
                            'results'
                        );

                        const data = {
                            results: results.value,
                            timestamp: new Date(),
                            mode: props.mode,
                        };

                        // Store results in Firestore
                        await addDoc(resultsCollectionRef, data);
                        // await setDoc(userResultsDocRef, data, { merge: true });
                        console.log('Results stored in Firestore:', data);
                    } else {
                        // User not logged in
                        console.error('User not logged in');
                    }
                });
            } catch (error) {
                // Handle error
                console.error('Error storing results in Firestore:', error);
            }
        };

        const calculatePercentage = async () => {
            // Calculate the percentage of correct answers
            const totalQuestions = questions.value.length;
            const percentageCorrectAnswers = Math.round((correctAnswers.value / totalQuestions) * 100);

            // Prepare the results object
            const resultData = {
                date: new Date().toISOString(),
                percentageCorrectAnswers,
                mode: props.mode,
            };
            results.value.push(resultData);
            storePercentageInFirestore(resultData);
        };

        const storePercentageInFirestore = async (resultData) => {
            try {
                onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        const userDoc = doc(db, 'users', user.uid);
                        await updateDoc(userDoc, {
                            quizResults: arrayUnion(resultData),
                        });
                        console.log('Percentage stored in Firestore:', resultData);
                    } else {
                        console.error('User not logged in');
                    }
                });
            } catch (error) {
                console.error('Error storing percentage in Firestore:', error);
            }
        };

        return {
            questions,
            currentQuestion,
            timer,
            selectAnswer,
            currentQuestionIndex,
            isFinished,
            results,
            answerSelected,
            selectedAnswer,
            storeResultsInFirestore,
            correctAnswers
        };
    }
};

</script>


<style scoped>

.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.w-full {
  width: 100%;
}

.consistent-card {
  max-width: 350px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
}

.text-wrap {
  white-space: normal;
  word-wrap: break-word;
  font-size: 16px;
}

.answer-button {
  width: 100%;
  margin-bottom: 8px;
}

</style>