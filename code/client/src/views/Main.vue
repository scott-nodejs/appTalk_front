<template>
    <div>
        <box-header />
        <router-view />
    </div>
</template>

<script>
    import Header from '@views/parts/Header'
    export default {
        name: "Main",
        asyncData({ store, route, accessToken = '' }) {
            // 触发 action 后，会返回 Promise
            return Promise.all([
                store.dispatch('PERSONAL_INFO',{ accessToken }),
                store.dispatch('website/GET_WEBSITE_INFO'),
            ])
        },
        mounted() {
            this.$store.dispatch('user/GET_UNREAD_MESSAGE_COUNT')
            this.$store.dispatch('user/GET_ASSOCIATE_INFO')
        },
        components: {
            'box-header': Header
        }
    }
</script>

<style scoped>

</style>