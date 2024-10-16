// Welcome Page
<template>
        <div class="welcome">
            <h1>Welcome to token.io</h1>
        </div>
        <router-link to="/login">
            <button class="start">
            Start learning now!
            </button>
        </router-link>

        <v-container>
            <v-row>
                <v-col cols="4" v-for="(v, index) in data" v-bind:key="index">
                    <v-sheet class="text-center">
                        {{ v }}
                        Hello
                    </v-sheet>
                </v-col>
            </v-row>
        </v-container>


</template>

<script>
    export default {
        name: 'WelcomePage',
    }
</script>


<style>

.start {
    background-color: #72a1cf;
    color: white;
    padding: 15px 30px;
    font-size: 18px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    margin-top: 20px;
}

</style>
