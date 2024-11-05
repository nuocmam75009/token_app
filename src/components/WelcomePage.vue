// Welcome Page
<template>
    <v-container class="welcome">
        <v-row>
            <v-col>
                <h1>Welcome to token.io</h1>
            </v-col>
        </v-row>
    </v-container>
    <v-btn
        prepend-icon="mdi-account"
        to="/login">
        Login
    </v-btn>
    <v-btn
        prepend-icon="mdi-account"
        to="/register">
        Register
    </v-btn>

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


</style>
