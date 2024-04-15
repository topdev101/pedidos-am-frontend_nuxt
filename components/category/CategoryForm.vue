<template>
    <form action="" method="post" @submit.prevent="submit()">
        <div class="row mx-n2">
            <div class="col-md-12 px-2 form-group">
                <label class="control-label">{{$t('page.name')}}</label>
                <input class="form-control" type="text" v-model="form.name" required :placeholder="$t('page.name')" />
                <has-error :form="form" field="name" />
            </div>
        </div>
        <hr class="my-2" />
        <div class="text-end">
            <button type="button" class="btn btn-danger" @click="closeModal('category_modal')"><i class="fe fe-x me-1"></i>{{$t('page.close')}}</button>
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
                name: '',
            }),
        };
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        },
    },
    mounted() {
        if (this.mode == 'edit') {
            this.getDetail()
        }
    },
    methods: {
        getDetail() {
            this.axios.get(`/category/get_detail/${this.id}`).then(response => {
                if (response.data.status == 'Success') {
                    let result = response.data.data;
                    this.form.id = result.id;
                    this.form.name = result.name;
                }
            });
        },
        submit() {
            this.form.post('category/save').then(response => {
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