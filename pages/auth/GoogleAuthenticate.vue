<template>
    <div class="container-login100">
        <div class="wrap-login100 p-6">
            <form class="login100-form validate-form" @submit.prevent="login" @keydown="form.onKeydown($event)">
                <span class="login100-form-title mb-4">
                    {{appName}}
                </span>
                <p class="text-center">{{$t('page.signin_to_continue')}}</p>
                <div class="form-group">
                    <label for="">{{ $t('page.one_time_password') }}</label>
                    <input type="text" v-model="form.one_time_password" class="form-control" :class="{ 'is-invalid': form.errors.has('one_time_password') }" :placeholder="$t('page.one_time_password')" />
                    <has-error :form="form" field="one_time_password" />
                </div>
                <div class="container-login100-form-btn">
                    <button type="submit" :class="{'btn-loading': form.busy}" class="login100-form-btn btn-primary">{{ $t('page.verify') }}</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import Form from "vform";
    export default {
        layout: "auth",
        middleware: "auth",
        data: () => ({
            appName: process.env.appName,
            form: new Form({
                one_time_password: "",
            }),
            remember: false,
        }),

        head() {
            return { title: this.$t("page.sign_in") };
        },

        mounted() {
            this.$isLoading(false);
        },

        methods: {
            async login() {
                let data;

                // Submit the form.
                try {
                    const response = await this.form.post("/2fa");
                    data = response.data;
                } catch (e) {
                    return;
                }

                // Redirect home.
                this.$router.push({ name: "dashboard" });
            },
        },
    };
</script>
