<template>
    <form @submit.prevent="submit" @keydown="form.onKeydown($event)">
        <div class="row">
            <div class="col-md-6 col-lg-4">
                <div class="form-group">
                    <label class="control-label">{{$t('page.purchase_date')}}</label>
                    <datepicker
                        v-model="form.purchased_at"
                        input-class="form-control"
                        format="yyyy-MM-dd"
                        :use-utc="true"
                        :typeable="true"
                        :placeholder="$t('page.purchase_date')"
                    ></datepicker>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="form-group">
                    <label class="control-label">{{$t('page.reference_no')}}</label>
                    <input class="form-control" type="text" v-model="form.reference_no" required :placeholder="$t('page.reference_no')" />
                    <has-error :form="form" field="reference_no" />
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="form-group">
                    <label class="control-label">{{$t('page.supplier')}}</label>
                    <div class="input-group">
                        <multiselect v-model="selected_supplier"
                            :options="suppliers"
                            :multiple="false"
                            :preserve-search="true"
                            :placeholder="$t('message.select_supplier')"
                            label="company"
                            track-by="id"
                            :show-labels="false"
                        >
                            <span slot="noOptions" class="no_option_slot d-none"></span>
                        </multiselect>
                        <div class="input-group-append">
                            <button type="button" class="btn btn-primary" @click="$modal.show('supplier_modal')"><i class="ti-plus"></i></button>
                        </div>
                    </div>
                    <has-error :form="form" field="supplier_id" />
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="form-group">
                    <label class="control-label">{{$t('page.vehicle_reference')}}</label>
                    <div class="input-group">
                        <multiselect v-model="selected_product"
                            :options="products"
                            :multiple="false"
                            :preserve-search="true"
                            :placeholder="$t('message.select_vehicle')"
                            :custom-label="customProductLabel"
                            track-by="id"
                            :show-labels="false"
                        >
                            <span slot="noOptions" class="no_option_slot d-none"></span>
                        </multiselect>
                        <div class="input-group-append">
                            <button type="button" class="btn btn-primary" @click="$modal.show('product_modal')"><i class="ti-plus"></i></button>
                        </div>
                    </div>
                    <has-error :form="form" field="product_id" />
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="form-group">
                    <label class="control-label">{{$t('page.attachment')}}</label>
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="customFile" @change="handleFile" multiple accept="image/*, video/*, application/pdf, .docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
                        <label class="custom-file-label" for="customFile">{{customFileName}}</label>
                    </div>
                    <div v-if="mode == 'edit' && images.length" class="mt-1">
                        <delete-image :images="images"></delete-image>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="form-group">
                    <label class="control-label">{{$t('page.estimated_date')}}</label>
                    <datepicker
                        v-model="form.estimated_date"
                        input-class="form-control"
                        format="yyyy-MM-dd"
                        :use-utc="true"
                        :typeable="true"
                        :placeholder="$t('page.estimated_date')"
                    ></datepicker>
                </div>
            </div>
            <div class="col-12 mb-3">
                <div class="mb-2 d-flex align-items-center">
                    <a href="javascript:;" class="btn btn-sm btn-primary ms-auto" @click="addCostItem()">
                        <i class="fe fe-plus"></i>
                    </a>
                </div>
                <div class="table-responsive">
                    <table class="table table-bordered" id="product_table">
                        <thead class="table-primary">
                            <tr>
                                <th>{{$t('page.concept')}}</th>
                                <th>{{$t('page.value_in_usd')}}</th>
                                <th>{{$t('page.exchange_rate')}}</th>
                                <th>{{$t('page.value_in_cop')}}</th>
                                <th style="width:30px"></th>
                            </tr>
                        </thead>
                        <tbody class="top-search-form">
                            <tr v-for="(item, index) in cost_items" :key="index">
                                <td class="p-1">
                                    <input v-if="item.default"
                                         :value="$t(`page['${item.concept}']`)"
                                         type="text"
                                         class="form-control form-control-sm"
                                         :placeholder="$t('page.concept')"
                                         readonly
                                    />
                                    <input v-else v-model="item.concept"
                                         type="text"
                                         class="form-control form-control-sm"
                                         :placeholder="$t('page.concept')"
                                    />
                                </td>
                                <td class="p-1">
                                    <input v-model="item.value_usd"
                                         type="text"
                                         class="form-control form-control-sm"
                                         required
                                         :placeholder="$t('page.value_in_usd')"
                                         @keyup="changeUsdValue(index)"
                                    />
                                </td>
                                <td class="p-1">
                                    <input v-model="item.exchange_rate"
                                         type="text"
                                         class="form-control form-control-sm"
                                         required
                                         :placeholder="$t('page.exchange_rate')"
                                         @keyup="changeUsdValue(index)"
                                    />
                                </td>
                                <td class="p-1">
                                    <input v-model="item.value_cop"
                                         type="number"
                                         class="form-control form-control-sm"
                                         required
                                         :placeholder="$t('page.value_in_cop')"
                                         @keyup="changeCopValue(index)"
                                    />
                                </td>
                                <td>
                                    <a href="javascript:;"
                                         class="text-danger btn-remove"
                                         @click="cost_items.splice(index, 1)"
                                         :class="item.default && 'disabled'"
                                    ><i class="ti-close"></i></a>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>{{$t('page.total')}}</th>
                                <th class="total">
                                    {{cost_items.reduce((a, b) => a + parseFloat(b.value_usd || 0), 0) | currency}}
                                </th>
                                <th></th>
                                <th class="total">
                                    {{cost_items.reduce((a, b) => a + parseFloat(b.value_cop || 0), 0) | currency}}
                                </th>
                                <th></th>
                            </tr>
                            <tr>
                                <th>{{$t('page.sale_price')}}</th>
                                <th class="p-1">
                                    <input v-model="form.sale_price"
                                         type="text"
                                         class="form-control form-control-sm"
                                         :placeholder="$t('page.value_in_usd')"
                                         @keyup="changeUsdValue('sale_price')"
                                         required
                                    />
                                </th>
                                <th class="p-1">
                                    <input v-model="form.exchange_rate"
                                         type="text"
                                         class="form-control form-control-sm"
                                         :placeholder="$t('page.exchange_rate')"
                                         @keyup="changeUsdValue('sale_price')"
                                         required
                                    />
                                </th>
                                <th class="p-1">
                                    <input v-model="form.sale_price_cop"
                                         type="text"
                                         class="form-control form-control-sm"
                                         :placeholder="$t('page.value_in_cop')"
                                         @keyup="changeCopValue('sale_price')"
                                         required
                                    />
                                    <has-error :form="form" field="sale_price" />
                                </th>
                                <th></th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <div class="col-md-12">
                <div class="form-group mb-2">
                    <label class="control-label">{{$t('page.note')}}:</label>
                    <textarea class="form-control" rows="4" v-model="form.note" :placeholder="$t('page.note')"></textarea>
                </div>
            </div>
        </div>
        <div class="mt-3 text-end">
            <button type="submit" class="btn btn-primary me-2" :class="{'btn-loading': form.busy}" :disabled="form.busy"><i class="fe fe-save mr-1"></i> {{$t('page.save')}}</button>
            <router-link :to="{name: 'purchase.index'}" class="btn btn-warning"><i class="fe fe-x me-1"></i>{{$t('page.cancel')}}</router-link>
        </div>
        <ui-modal name="supplier_modal"
            :title="$t('page.add_supplier')"
        >
            <supplier-form mode="add"
                @submit="addSupplier"
            />
        </ui-modal>
    </form>
</template>
<script>
import Form from "vform";
import Datepicker from 'vuejs-datepicker';
import SupplierForm from "~/components/supplier/SupplierForm.vue"
import DeleteImage from "~/components/image/DeleteImage.vue"
import { mapGetters } from "vuex";
export default {
    name: 'PurchaseForm',
    props: ['mode', 'id'],
    components: {
        Datepicker, SupplierForm, DeleteImage
    },
    data() {
        return {
            products: [],
            custom_agents: [],
            selected_supplier: null,
            selected_product: null,
            selected_custom_agent: null,
            form: new Form({
                id: '',
                purchased_at: this.$moment().format('YYYY-MM-DD'),
                reference_no: null,
                product_id: null,
                supplier_id: null,
                custom_agent_id: null,
                estimated_date: '',
                exchange_rate: '',
                bl_number: '',
                import_type: 'direct',
                import_company: '',
                total_cost: 0,
                total_cost_cop: 0,
                sale_price: '',
                sale_price_cop: '',
                note: '',
                cost_items: '',
                images: null,
            }),
            images: [],
            customFileName: this.$t('page.choose_file'),
            cost_items: [
                {
                    concept: 'Cost of Vehicle',
                    value_usd: '',
                    value_cop: '',
                    exchange_rate: '',
                    default: true,
                },
                {
                    concept: 'Custom Taxes',
                    value_usd: '',
                    value_cop: '',
                    exchange_rate: '',
                    default: true,
                },
                {
                    concept: 'Shipment',
                    value_usd: '',
                    value_cop: '',
                    exchange_rate: '',
                    default: true,
                },
                {
                    concept: 'Other Expenses',
                    value_usd: '',
                    value_cop: '',
                    exchange_rate: '',
                    default: true,
                },
            ],
        };
    },
    computed: mapGetters({
        auth_user: 'auth/user',
        suppliers: 'data/suppliers',
    }),
    watch: {
        selected_supplier: function (newVal) {
            this.form.supplier_id = newVal?.id;
        },
        selected_product: function (newVal) {
            this.form.product_id = newVal?.id;
        },
        selected_custom_agent: function (newVal) {
            this.form.custom_agent_id = newVal?.id;
        },
        cost_items: {
            handler: function(value) {
                this.calcTotalCost();
                this.form.cost_items = JSON.stringify(value);
            },
            deep: true
        },
    },
    filters: {
        currency: function (value) {
            value = Number(value);
            return value.toLocaleString();
        }
    },
    mounted() {
        this.getProducts();
        this.getCustomAgents();
        if (this.mode == 'edit') {
            this.load();
        } else {
            this.getExchangeRate();
            this.getNextReferenceNo();
        }
    },
    methods: {
        load() {
            this.axios.get(`/purchase/get_detail/${this.id}`).then(response => {
                if (response.data.status == 'Success') {
                    let purchase = response.data.data;
                    this.form.id = purchase.id;
                    this.form.purchased_at = this.$moment(purchase.purchased_at).format('YYYY-MM-DD');
                    this.form.reference_no = purchase.reference_no;
                    this.form.product_id = purchase.product_id;
                    this.form.supplier_id = purchase.supplier_id;
                    this.form.estimated_date = this.$moment(purchase.estimated_date).format('YYYY-MM-DD');
                    this.form.bl_number = purchase.bl_number;
                    this.form.import_type = purchase.import_type;
                    this.form.import_company = purchase.import_company;
                    this.form.total_cost = purchase.total_cost;
                    this.form.total_cost_cop = purchase.total_cost_cop;
                    this.form.sale_price = purchase.sale_price;
                    this.form.sale_price_cop = purchase.sale_price_cop;
                    this.form.note = purchase.note;

                    this.cost_items = purchase.cost_items;
                    this.images = purchase.images

                    this.selected_supplier = purchase.supplier;
                    this.selected_product = purchase.product;
                    this.selected_custom_agent = purchase.custom_agent;
                    this.form.exchange_rate = purchase.exchange_rate;
                }
            });
        },
        async getExchangeRate() {
            const response = await this.axios.get('/get_latest_exchange_rate');
            this.form.exchange_rate = response.data.data;
            this.cost_items.map(i => {
                i.exchange_rate = this.form.exchange_rate;
            });
        },
        async getProducts() {
            const response = await this.axios.get('/get_products?purchased=no');
            this.products = response.data.data;
        },
        async getCustomAgents() {
            const response = await this.axios.get('/get_custom_agents');
            this.custom_agents = response.data.data;
        },
        async getNextReferenceNo() {
            const response = await this.axios.get('/purchase/get_next_reference_no');
            this.form.reference_no = response.data.data;
        },
        async submit() {
            try {
                let uri = this.mode == 'edit' ? '/purchase/update' : '/purchase/create';
                const response = await this.form.post(uri);
                if (response.data.status == 'Success') {
                    this.$toast.success(this.$t('message.successfully_done'));
                    this.$router.push({name: 'purchase.index'});
                }
            } catch (error) { }
        },
        handleFile(event) {
            var fileName = event.target.value.split("\\").pop();
            this.customFileName = fileName;
            const files = event.target.files;
            this.form.images = files;
        },
        closeModal(modalId) {
            this.$modal.hide(modalId);
        },
        addCostItem() {
            this.cost_items.push({
                concept: '',
                vlaue_usd: '',
                vlaue_cop: '',
                exchange_rate: this.form.exchange_rate
            });
        },
        calcTotalCost() {
            this.form.total_cost = this.cost_items.reduce((a, b) => a + parseInt(b.value_usd), 0);
            this.form.total_cost_cop = this.cost_items.reduce((a, b) => a + parseInt(b.value_cop), 0);
        },
        changeUsdValue(index) {
            if (index === 'sale_price') {
                this.form.sale_price_cop = Math.round(this.form.sale_price * this.form.exchange_rate);
            } else {
                const rate = this.cost_items[index].exchange_rate;
                this.cost_items[index].value_cop = Math.round(this.cost_items[index].value_usd * rate);
            }
        },
        changeCopValue(index) {
            if (index === 'sale_price') {
                this.form.sale_price = Math.round(this.form.sale_price_cop / this.form.exchange_rate);
            } else {
                const rate = this.cost_items[index].exchange_rate;
                console.log(this.cost_items[index].value_cop)
                this.cost_items[index].value_usd = Math.round(this.cost_items[index].value_cop / rate);
            }
        },
        addSupplier(data) {
            this.$store.dispatch('data/getSuppliers');
            this.selected_supplier = data;
            this.$modal.hide('supplier_modal');
        },
        addProduct(data) {
            this.products.unshift(data);
            this.selected_product = data;
            this.$modal.hide('product_modal');
        },
        addCustomAgent(data) {
            this.custom_agents.unshift(data);
            this.selected_custom_agent = data;
            this.$modal.hide('custom_agent_modal');
        },
        customProductLabel ({ reference, vin, engine_number }) {
            return `${reference} (${engine_number} / ${vin})`;
        }
    }

}
</script>
<style lang="scss" scoped>
    .btn-remove {
        display: block;
        border-radius: 100%;
        &.disabled {
            pointer-events: none;
        }
    }
    th.total {
        padding-left: 18px;
    }

    .input-group::v-deep {
        .multiselect__content-wrapper {
            width: calc(100% + 56px);
        }
    }
</style>