<template>
    <form @submit.prevent="submit">
        <div class="form-group">
            <label class="control-label">{{ $t('page.status') }}</label>
            <select v-model="form.status" class="form-control" required>
                <option value="" hidden>{{ $t('page.status') }}</option>
                <option v-for="item in statuses"
                     :key="item.value"
                     :value="item.value"
                     :disabled="item.disable"
                >
                    {{ $t(`page.${item.value}`) }}
                </option>
            </select>
        </div>
        <div v-if="form.status === 'in_sale_window'" class="form-group">
            <label class="control-label">{{$t('page.customer')}}</label>
            <div class="input-group">
                <multiselect v-model="selected_customer"
                    :options="customers"
                    :multiple="false"
                    :preserve-search="true"
                    :placeholder="$t('message.select_customer')"
                    label="company"
                    track-by="id"
                    :show-labels="false"
                >
                    <span slot="noOptions" class="no_option_slot d-none"></span>
                </multiselect>
                <div class="input-group-append">
                    <button type="button" class="btn btn-primary" @click="$modal.show('customer_modal')"><i class="ti-plus"></i></button>
                </div>
            </div>
            <has-error :form="form" field="customer_id" />
        </div>
        <div class="text-end">
            <button type="button" class="btn btn-danger" @click="$modal.hide('product_status_modal')"><i class="fe fe-x me-1"></i>{{$t('page.close')}}</button>
            <button type="submit" class="btn btn-primary ms-2" :class="{'btn-loading': form.busy}" :disabled="form.busy"><i class="fe fe-save me-1"></i>{{$t('page.save')}}</button>
        </div>
        <ui-modal name="customer_modal"
            :title="$t('page.add_customer')"
        >
            <customer-form mode="add"
                    @submit="addCustomer"
            />
        </ui-modal>
    </form>
</template>
<script>
import Form from "vform";
export default {
    name: 'ProductStatusForm',
    props: {
        product: { type: Object, required: true },
    },
    data() {
        return {
            form: new Form({
                product_id: this.product.id,
                customer_id: '',
                status: this.product.status,
            }),
            statuses: [
                {value: 'in_the_city_of_purchase', disable: true },
                {value: 'on_the_way', disable: true },
                {value: 'in_destination_port', disable: false },
                {value: 'in_sale_window', disable: false },
                {value: 'sold', disable: true },
            ],
            customers: [],
            selected_customer: null,
        };
    },
    watch: {
        selected_customer: function (newVal) {
            this.form.customer_id = newVal?.id;
        },
    },
    mounted() {
        this.getCustomers();
    },
    methods: {
        async getCustomers() {
            const response = await this.axios.get('/get_customers');
            this.customers = response.data.data;
            if (this.product.sale_window) {
                this.selected_customer = this.customers.find(i => i.id === this.product.sale_window.customer_id);
            }
        },
        async submit() {
            try {
                const response = await this.form.post('/product/update_status');
                if (response.data.status === 'Success') {
                    this.$emit('change', response.data.data);
                }
            } catch (error) {

            }
        },
        addCustomer(data) {
            this.customers.unshift(data);
            this.selected_customer = data;
            this.$modal.hide('customer_modal');
        },
    }
}
</script>