<template>
    <form action="" method="post" @submit.prevent="submit()">
        <div class="row mx-n2">
            <div v-if="auth_user.role === 'admin'" class="col-md-6 px-2 form-group">
                <label class="control-label">{{$t('page.company')}}</label>
                <select class="form-control" v-model="form.company_id" required>
                    <option value="" hidden>{{ $t('page.company') }}</option>
                    <option v-for="(item, index) in companies" :key="index" :value="item.id">{{ item.name }}</option>
                </select>
                <has-error :form="form" field="company_id" />
            </div>
            <div class="col-md-6 px-2 form-group">
                <label class="control-label">{{$t('page.name')}}</label>
                <input class="form-control" type="text" v-model="form.name" required :placeholder="$t('page.name')" />
                <has-error :form="form" field="name" />
            </div>
            <div class="col-md-6 px-2 form-group">
                <label class="control-label">{{$t('page.brand')}}</label>
                <input class="form-control" type="text" v-model="form.brand" required :placeholder="$t('page.brand')" />
                <has-error :form="form" field="brand" />
            </div>
            <div class="col-md-6 px-2 form-group">
                <label class="control-label">{{$t('page.discount')}}</label>
                <input class="form-control" type="text" v-model="form.discount" required :placeholder="$t('page.discount')" />
                <has-error :form="form" field="discount" />
            </div>
            <div class="col-md-6 px-2 form-group">
                <label class="control-label">{{$t('page.phone_number')}}</label>
                <input class="form-control" type="text" v-model="form.phone_number" required :placeholder="$t('page.phone_number')" />
                <has-error :form="form" field="phone_number" />
            </div>
            <div class="px-2 form-group" :class="{'col-md-6': auth_user.role === 'admin', 'col-md-12': auth_user.role !== 'admin'}">
                <label class="control-label">{{$t('page.address')}}</label>
                <input class="form-control" type="text" v-model="form.address" required :placeholder="$t('page.address')" />
                <has-error :form="form" field="address" />
            </div>
        </div>
        <div class="form-group">
            <label class="control-label">{{$t('page.note')}}</label>
            <textarea class="form-control" rows="3" v-model="form.note" :placeholder="$t('page.note')"></textarea>
        </div>
        <hr class="my-2" />
        <div class="text-end">
            <button type="button" class="btn btn-danger" @click="closeModal('supplier_modal')"><i class="fe fe-x me-1"></i>{{$t('page.close')}}</button>
            <button type="submit" class="btn btn-primary ms-2" :class="{'btn-loading': form.busy}" :disabled="form.busy"><i class="fe fe-save me-1"></i>{{$t('page.save')}}</button>
        </div>
    </form>
</template>

<script>
import Form from "vform";
export default {
    props: ['mode', 'id'],
    data() {
        return {
            form: new Form({
                id: this.id,
                company_id: '',
                name: '',
                brand: '',
                email: '',
                phone_number: '',
                country_id: '',
                address: '',
                discount: '',
                note: '',
            }),
        };
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        },
        companies() {
            return this.$store.getters['data/companies'];
        }
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
            this.axios.get(`/supplier/get_detail/${this.id}`).then(response => {
                if (response.data.status == 'Success') {
                    let result = response.data.data;
                    this.form.id = result.id;
                    this.form.company_id = result.company_id;
                    this.form.name = result.name;
                    this.form.brand = result.brand;
                    this.form.phone_number = result.phone_number;
                    this.form.address = result.address;
                    this.form.discount = result.discount;
                    this.form.note = result.note;
                }
            });
        },
        submit() {
            this.form.post('supplier/save').then(response => {
                if (response.data.status == 'Success') {
                    this.$toast.success(this.$t('message.successfully_done'));
                    this.$emit('submit', response.data.data);
                }
            });
        },
        closeModal(modalId) {
            this.$modal.hide(modalId);
        },
    }
}
</script>