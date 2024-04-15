<template>
    <div class="card">
        <div class="card-header">
            {{ $t('page.my_profile') }}
        </div>
        <div class="card-body">
            <form @submit.prevent="update" @keydown="form.onKeydown($event)">
                <!-- Username -->
                <div class="row mb-3">
                    <label class="col-md-3 col-form-label text-md-right">{{ $t('page.username') }}</label>
                    <div class="col-md-9">
                        <input v-model="form.username" :class="{ 'is-invalid': form.errors.has('username') }" type="text" name="username" class="form-control" :placeholder="$t('page.username')" />
                        <has-error :form="form" field="username" />
                    </div>
                </div>

                <!-- Email -->
                <div class="row mb-3">
                    <label class="col-md-3 col-form-label text-md-right">{{ $t('page.email') }}</label>
                    <div class="col-md-9">
                        <input v-model="form.email" :class="{ 'is-invalid': form.errors.has('email') }" type="email" name="email" class="form-control" :placeholder="$t('page.email')" />
                        <has-error :form="form" field="email" />
                    </div>
                </div>

                <!-- First Name -->
                <div class="row mb-3">
                    <label class="col-md-3 col-form-label text-md-right">{{ $t('page.first_name') }}</label>
                    <div class="col-md-9">
                        <input v-model="form.first_name" :class="{ 'is-invalid': form.errors.has('first_name') }" type="text" name="first_name" class="form-control" :placeholder="$t('page.first_name')" />
                        <has-error :form="form" field="first_name" />
                    </div>
                </div>

                <!-- Last Name -->
                <div class="row mb-3">
                    <label class="col-md-3 col-form-label text-md-right">{{ $t('page.last_name') }}</label>
                    <div class="col-md-9">
                        <input v-model="form.last_name" :class="{ 'is-invalid': form.errors.has('last_name') }" type="text" name="last_name" class="form-control" :placeholder="$t('page.last_name')" />
                        <has-error :form="form" field="last_name" />
                    </div>
                </div>

                <!-- Phone Number -->
                <div class="row mb-3">
                    <label class="col-md-3 col-form-label text-md-right">{{ $t('page.phone_number') }}</label>
                    <div class="col-md-9">
                        <input v-model="form.phone_number" :class="{ 'is-invalid': form.errors.has('phone_number') }" type="text" name="phone_number" class="form-control" :placeholder="$t('page.phone_number')" />
                        <has-error :form="form" field="phone_number" />
                    </div>
                </div>

                <!-- Company -->
                <div class="row mb-3">
                    <label class="col-md-3 col-form-label text-md-right">{{ $t('page.picture') }}</label>
                    <div class="col-md-9">
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" id="customFile" @change="handleFile" accept="image/*" />
                            <label class="custom-file-label" for="customFile" style="font-size: 1rem;">{{customFileName}}</label>
                        </div>
                        <has-error :form="form" field="photo" />
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="row mb-3">
                    <div class="col-md-9 ms-md-auto">
                        <button type="submit" class="btn btn-primary" :class="form.busy && 'btn-loading'">
                            <i class="ti-save"></i>
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
import { mapGetters } from "vuex";

export default {
    middleware: 'auth',
    scrollToTop: false,
    data(){
        return {
            form: new Form({
                username: "",
                email: "",
                first_name: "",
                last_name: "",
                phone_number: "",
                photo: null,
            }),
            customFileName: this.$t('page.choose_file'),
            imageData: null,
        }
    },

    head() {
        return { title: this.$t("page.profile") };
    },

    computed: mapGetters({
        user: "auth/user",
        companies: 'data/companies',
    }),

    created() {
        // Fill the form with user data.
        this.form.keys().forEach((key) => {
            this.form[key] = this.user[key];
        });
    },

    methods: {
        update() {
            this.form.post("/account/profile").then(response => {
                if (response.data.status == 'Success') {
                    let user = response.data.data;
                    this.$store.dispatch("auth/updateUser", { user });
                    this.$toast.success(this.$t('message.updated_successfully'));
                }
            });
        },
        handleFile(event) {
            var fileName = event.target.value.split("\\").pop();
            this.customFileName = fileName;
            const file = event.target.files[0];
            this.form.photo = file;
        },
    },
};
</script>
