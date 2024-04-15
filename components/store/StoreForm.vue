<template>
    <form action="" method="post" @submit.prevent="submit()">
        <div class="form-group">
            <label class="control-label">{{$t('page.company')}}</label>
            <select class="form-control" v-model="form.company" required>
                <option value="" hidden>{{ $t('page.company') }}</option>
                <option v-for="(item, index) in companies" :key="index" :value="item.id">{{ item.name }}</option>
            </select>
            <has-error :form="form" field="company" />
        </div>
        <div class="form-group">
            <label class="control-label">{{$t('page.name')}}</label>
            <input class="form-control" type="text" v-model="form.name" required :placeholder="$t('page.name')" />
            <has-error :form="form" field="name" />
        </div>
        <hr class="my-2" />
        <div class="text-end">
            <button type="button" class="btn btn-danger" @click="closeModal('store_modal')"><i class="fe fe-x me-1"></i>{{$t('page.close')}}</button>
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
                company: '',
                name: '',
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
        }
    },
    methods: {
        getDetail() {
            this.axios.get(`/store/get_detail/${this.id}`).then(response => {
                if (response.data.status == 'Success') {
                    let result = response.data.data;
                    this.form.id = result.id;
                    this.form.name = result.name;
                    this.form.company = result.company_id;
                }
            });
        },
        submit() {
            this.form.post('store/save').then(response => {
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