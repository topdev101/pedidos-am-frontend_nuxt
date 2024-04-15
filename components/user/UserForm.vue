<template>
    <form action="" method="post" @submit.prevent="submit()">
        <div class="row mx-n2">
            <div class="col-md-6 px-2">
                <div class="form-group">
                    <label class="control-label">{{$t('page.company')}}</label>
                    <select class="form-control" v-model="form.company_id" :required="form.role != 'admin'" :disabled="form.role === 'admin'">
                        <option value="" hidden>{{ $t('page.company') }}</option>
                        <option v-for="(item, index) in companies" :key="index" :value="item.id">{{ item.name }}</option>
                    </select>
                    <has-error :form="form" field="company_id" />
                </div>
            </div>
            <div class="col-md-6 px-2">
                <div class="form-group">
                    <label class="control-label">{{$t('page.username')}}</label>
                    <input class="form-control" type="text" v-model="form.username" required :placeholder="$t('page.username')" />
                    <has-error :form="form" field="username" />
                </div>
            </div>
            <div class="col-md-6 px-2">
                <div class="form-group">
                    <label class="control-label">{{$t('page.first_name')}}</label>
                    <input class="form-control" type="text" v-model="form.first_name" required :placeholder="$t('page.first_name')" />
                    <has-error :form="form" field="first_name" />
                </div>
            </div>
            <div class="col-md-6 px-2">
                <div class="form-group">
                    <label class="control-label">{{$t('page.last_name')}}</label>
                    <input class="form-control" type="text" v-model="form.last_name" required :placeholder="$t('page.last_name')" />
                    <has-error :form="form" field="last_name" />
                </div>
            </div>
            <div class="col-md-6 px-2">
                <div class="form-group">
                    <label class="control-label">{{$t('page.phone_number')}}</label>
                    <input class="form-control" type="text" v-model="form.phone_number" :placeholder="$t('page.phone_number')" />
                    <has-error :form="form" field="phone_number" />
                </div>
            </div>
            <div class="col-md-6 px-2">
                <div class="form-group">
                    <label class="control-label">{{$t('page.role')}}</label>
                    <select class="form-control" v-model="form.role" required @change="changeRole">
                        <option value="" hidden>{{ $t('page.role') }}</option>
                        <option value="admin">{{ $t('page.admin') }}</option>
                        <option value="user">{{ $t('page.user') }}</option>
                        <option value="secretary">{{ $t('page.secretary') }}</option>
                    </select>
                    <has-error :form="form" field="role" />
                </div>
            </div>
            <div class="col-md-6 px-2">
                <div class="form-group">
                    <label class="control-label">{{$t('page.ip_address')}}</label>
                    <input class="form-control" type="text" name="ip_address" v-model="form.ip_address" :placeholder="$t('page.ip_address')" />
                    <has-error :form="form" field="ip_address" />
                </div>
            </div>
            <div class="px-2" :class="{'col-md-12': auth_user.role !== 'admin', 'col-md-6': auth_user.role === 'admin'}">
                <div class="form-group">
                    <label class="control-label">{{$t('page.google_authenticator')}}</label>
                    <select class="form-control" v-model="form.enable_google2fa">
                        <option value="1">{{$t('page.active')}}</option>
                        <option value="0">{{$t('page.inactive')}}</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label class="control-label">{{$t('page.password')}}</label>
            <input class="form-control" type="password" name="password" v-model="form.password" :placeholder="$t('page.password')" />
            <span class="invalid-feedback d-block">{{$t('message.password_rule')}}</span>
            <has-error :form="form" field="password" />
        </div>
        <div class="form-group">
            <label class="control-label">{{$t('page.password_confirm')}}</label>
            <input class="form-control" type="password" v-model="form.password_confirmation" :placeholder="$t('page.password_confirm')" />
        </div>
        <hr class="my-2" />
        <div class="text-end">
            <button type="button" class="btn btn-danger" @click="closeModal('user_modal')"><i class="fe fe-x me-1"></i>{{$t('page.close')}}</button>
            <button type="submit" class="btn btn-primary ms-2" :class="{'btn-loading': form.busy}" :disabled="form.busy"><i class="fe fe-save me-1"></i>{{$t('page.save')}}</button>
        </div>
    </form>
</template>

<script>
import Form from "vform";
import {mapGetters} from "vuex";
export default {
    props: ['mode', 'id'],
    data() {
        return {
            form: new Form({
                id: this.id,
                company_id: '',
                username: '',
                first_name: '',
                last_name: '',
                phone_number: '',
                ip_address: '',
                role: 'user',
                enable_google2fa: 1,
                password: '',
                password_confirmation: '',
            }),
        };
    },
    computed: {
        ...mapGetters({
            auth_user: 'auth/user',
            companies: 'data/companies',
        })
    },
    mounted() {
        if (this.mode == 'edit') {
            this.getDetail()
        } else {
            if (this.auth_user.company_id) {
                this.form.company_id = this.auth_user.company_id;
            }
        }
    },
    methods: {
        getDetail() {
            this.axios.get(`/user/get_detail/${this.id}`).then(response => {
                if (response.data.status === 'Success') {
                    let result = response.data.data;
                    this.form.company_id = result.company_id;
                    this.form.username = result.username;
                    this.form.first_name = result.first_name;
                    this.form.last_name = result.last_name;
                    this.form.phone_number = result.phone_number;
                    this.form.ip_address = result.ip_address;
                    this.form.role = result.role;
                    this.form.enable_google2fa = result.enable_google2fa;
                }
            });
        },
        submit() {
            let uri = this.mode == 'edit' ? '/user/update' : 'user/create';
            this.form.post(uri).then(response => {
                if (response.data.status == 'Success') {
                    this.$toast.success(this.$t('message.successfully_done'));
                    this.$emit('submit');
                }
            });
        },
        closeModal(modalId) {
            this.$modal.hide(modalId);
        },
        changeRole(e) {
            if (e.target.value === 'admin') {
                this.form.company_id = '';
            }
        }
    }
}
</script>