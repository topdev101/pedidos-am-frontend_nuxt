<template>
    <div class="container-login100">
        <div v-if="step == 'login'" class="wrap-login100 px-4 px-md-6 py-6">
            <form class="login100-form validate-form" @submit.prevent="login" @keydown="form.onKeydown($event)" autocomplete="off">
                <span class="login100-form-title pb-4">
                    {{ $t('page.sign_in') }}
                </span>
                <p class="text-center">{{$t('page.signin_to_continue')}}</p>
                <div>
                    <label>{{ $t('page.username') }}</label>
                    <div class="wrap-input100 validate-input">
                        <input type="text" name="username" v-model="form.username" class="input100" :class="{ 'is-invalid': form.errors.has('username') }" :placeholder="$t('page.username')" />
                        <span class="focus-input100"></span>
                        <has-error :form="form" field="username" />
                    </div>
                </div>
                <div>
                    <label>{{ $t('page.password') }}</label>
                    <input type="text" name="password" v-model="form.password" class="input100 password-input" :class="{ 'is-invalid': form.errors.has('password') }" :placeholder="$t('page.password')" />
                    <span class="focus-input100"></span>
                    <has-error :form="form" field="password" />
                </div>
                <div class="container-login100-form-btn">
                    <button type="submit" :class="{'btn-loading': form.busy}" class="login100-form-btn btn-primary">{{ $t('page.sign_in') }}</button>
                </div>
                <!-- <div class="text-center py-3">
                    <a class="text-dark mb-0 text-primary text-decoration-underline" href="forgot-password.html">Forgot password?</a>
                </div> -->
            </form>
        </div>
        <div v-if="auth_user && step == '2fa'" class="wrap-login100 px-4 px-md-6 py-6" style="max-width: 385px;">
            <div v-if="!auth_user.google2fa_secret">
                <p>{{ $t('message.generate_secret_key') }}</p>
                <a href="javascript:;" class="btn btn-primary mt-2 mx-auto d-block"
                    @click="getQrCode(true)"
                >{{$t('page.generate_qr_code')}}</a>
            </div>
            <div v-else>
                <div v-if="!auth_user.enable_google2fa">
                    <div v-if="QR_Code">
                        <p>{{ $t('message.scan_qr_code') }}</p>
                        <div class="qr-container text-center">
                            <div v-html="QR_Code" class="qrcode"></div>
                        </div>
                    </div>
                </div>
                <form class="login100-form validate-form" @submit.prevent="checkOTP" @keydown="otp_form.onKeydown($event)">
                    <p>{{ $t('message.input_one_time_password') }}</p>
                    <div class="form-group">
                        <label>{{ $t('page.one_time_password') }}</label>
                        <input type="text" v-model="otp_form.one_time_password" class="input100" :class="{ 'is-invalid': form.errors.has('one_time_password') }" :placeholder="$t('page.one_time_password')" />
                        <has-error :form="otp_form" field="one_time_password" />
                    </div>
                    <div class="container-login100-form-btn">
                        <button type="submit" :class="{'btn-loading': otp_form.busy}" class="login100-form-btn btn-primary">{{ $t('page.verify') }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import Form from "vform";
    export default {
        layout: "auth",
        middleware: "guest",
        data: () => ({
            appName: process.env.appName,
            secretaryDomain: process.env.secretaryDomain,
            form: new Form({
                username: "",
                password: "",
            }),
            remember: false,
            step: 'login',
            token: '',
            auth_user: null,
            otp_form: new Form({
                google2fa_secret: '',
                one_time_password: "",
            }),
            QR_Code: '',
        }),

        head() {
            return { title: this.$t("page.sign_in") };
        },

        computed: {
            is_secretary_domain() {
                return this.secretaryDomain === window.location.hostname
            }
        },

        methods: {
            async login() {
                let data;

                // Submit the form.
                try {
                    const response = await this.form.post("/login");
                    data = response.data;
                    this.token = data.token;
                } catch (e) {
                    return;
                }

                this.auth_user = data.auth_user;

                // this.saveToken(this.token);

                this.step = '2fa';
                if (this.auth_user.enable_google2fa) {
                    this.otp_form.google2fa_secret = this.auth_user.google2fa_secret
                } else if (this.auth_user.google2fa_secret) {
                    // this.saveToken(data.token)
                    this.getQrCode();
                }
            },
            async checkOTP() {
                let data;

                // Submit the form.
                try {
                    const response = await this.otp_form.post("/2fa");
                    data = response.data;
                } catch (e) {
                    return;
                }

                this.saveToken(this.token);
            },
            async saveToken(token) {
                // Save the token.
                await this.$store.dispatch("auth/saveToken", {
                    token: token,
                    remember: this.remember,
                });
                await this.$nextTick();
                // Fetch the user.
                // await this.$store.dispatch("auth/fetchUser");

                // Redirect home.
                this.$router.push({ name: "dashboard" });
            },
            async getQrCode(regenerate) {
                const payload = {
                    user_id: this.auth_user.id,
                    regenerate: regenerate
                }
                const response = await this.axios.post('/account/generate_2fa_code', payload);
                this.QR_Code = response.data.data.qr_code;
                const google2fa_secret =  response.data.data.secret_code;
                this.auth_user.google2fa_secret = google2fa_secret;
                this.otp_form.google2fa_secret = google2fa_secret;
            }
        },
    };
</script>
<style lang="scss" scoped>
    .password-input {
        -webkit-text-security: disc;
    }
</style>
