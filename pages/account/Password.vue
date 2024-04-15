<template>
    <div class="card">
        <div class="card-header">
            {{ $t('page.your_password') }}
        </div>
        <div class="card-body">
            <form @submit.prevent="update" @keydown="form.onKeydown($event)">
                <!-- Password -->
                <div class="row mb-3">
                    <label class="col-md-3 col-form-label text-md-right">{{ $t('page.new_password') }}</label>
                    <div class="col-md-9">
                        <input v-model="form.password" :class="{ 'is-invalid': form.errors.has('password') }" type="password" name="password" class="form-control" />
                        <has-error :form="form" field="password" />
                    </div>
                </div>

                <!-- Password Confirmation -->
                <div class="row mb-3">
                    <label class="col-md-3 col-form-label text-md-right">{{ $t('page.confirm_password') }}</label>
                    <div class="col-md-9">
                        <input v-model="form.password_confirmation" :class="{ 'is-invalid': form.errors.has('password_confirmation') }" type="password" name="password_confirmation" class="form-control" />
                        <span class="invalid-feedback d-block">{{$t('message.password_rule')}}</span>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="row mb-3">
                    <div class="col-md-9 ms-md-auto">
                        <button type="submit" class="btn btn-primary" :class="form.busy && 'btn-loading'">
                            {{ $t('page.update') }}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import Form from "vform";
    export default {
        middleware: 'auth',
        scrollToTop: false,

        data: () => ({
            form: new Form({
                password: "",
                password_confirmation: "",
            }),
        }),

        head() {
            return { title: this.$t("page.password") };
        },

        methods: {
            update() {
                this.form.patch("/account/password").then(() => {
                    this.$toast.success(this.$t('message.updated_successfully'));
                    this.form.reset();
                });
            },
        },
    };
</script>
