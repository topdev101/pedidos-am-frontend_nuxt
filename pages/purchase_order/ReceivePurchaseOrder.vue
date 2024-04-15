<template>
    <div class="main-container container-fluid">
        <div class="page-header">
            <h4 class="page-title mb-0"><i class="mdi mdi-truck-check-outline menu-icon"></i> {{$t('page.receive_purchase_order')}}</h4>
            <nav aria-label="breadcrumb mb-0">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><router-link :to="{name: 'dashboard'}">{{$t('page.home')}}</router-link></li>
                    <li class="breadcrumb-item"><router-link :to="{name: 'purchase_order.index'}">{{$t('page.purchase_orders')}}</router-link></li>
                    <li class="breadcrumb-item active" aria-current="page">{{$t('page.receive')}}</li>
                </ol>
            </nav>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card card-body page-content-card">
                    <form @submit.prevent="submit" @keydown="form.onKeydown($event)">
                        <div class="row mx-n2">
                            <div class="col-12 mb-3 px-2">
                                <div class="d-flex form-inline mb-2">
                                    <input type="text" class="form-control ms-auto" v-model="product_keyword" :placeholder="$t('page.product')" />
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead class="table-primary">
                                            <tr>
                                                <th>#</th>
                                                <th>{{$t('page.product')}}</th>
                                                <th>{{$t('page.cost')}}</th>
                                                <th>{{$t('page.discount')}}</th>
                                                <th>{{$t('page.ordered_quantity')}}</th>
                                                <th>{{$t('page.received_quantity')}}</th>
                                                <th>{{$t('page.balance')}}</th>
                                                <th>{{$t('page.receive')}}</th>
                                                <th>{{$t('page.category')}}</th>
                                                <th>{{$t('page.subtotal')}}</th>
                                            </tr>
                                        </thead>
                                        <tbody class="top-search-form">
                                            <tr v-for="(item, index) in purchase_items"
                                                 :key="index"
                                                 :class="{'d-none': item.quantity == item.received_quantity}"
                                            >
                                                <td><input type="checkbox" v-model="item.checked" /></td>
                                                <td :class="item_images.find(i => i.id === item.id).images.length && 'py-1'">
                                                    {{item.product}}
                                                    <span v-if="item_images.find(i => i.id === item.id).images" class="clearfix" v-viewer>
                                                        <img v-for="img in item_images.find(i => i.id === item.id).images" :key="img.id" :src="img.src" style="width: 30px; height: 30px;" class="item-image me-1" />
                                                    </span>
                                                </td>
                                                <td>{{item.cost | currency}}</td>
                                                <td>{{item.discount_string}}</td>
                                                <td>{{item.quantity}}</td>
                                                <td>{{item.received_quantity}}</td>
                                                <td>{{item.quantity - item.received_quantity}}</td>
                                                <td class="p-1">
                                                    <input
                                                        type="number"
                                                        class="form-control form-control-sm"
                                                        v-model="item.receive"
                                                        :placeholder="$t('page.quantity')"
                                                        required
                                                        :max="item.quantity - item.received_quantity"
                                                    />
                                                </td>
                                                <td>{{item.category?.name}}</td>
                                                <td class="subtotal">
                                                    {{(item.cost - item.discount) * item.receive | currency}}
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th colspan="3">{{$t('page.total')}}</th>
                                                <th>{{purchase_items.filter(i => i.checked).reduce((a, b) => a + parseInt(b.discount * b.receive), 0) | currency}}</th>
                                                <th colspan="5"></th>
                                                <th class="total">{{purchase_items.filter(i => i.checked).reduce((a, b) => a + parseInt((b.cost - b.discount) * b.receive), 0) | currency}}</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <div class="col-md-6 col-lg-3 mb-3 px-2">
                                <div class="form-group">
                                    <label class="control-label">{{$t('page.reference_no')}}</label>
                                    <input class="form-control" type="text" v-model="form.reference_no" required :placeholder="$t('page.reference_no')" />
                                    <has-error :form="form" field="reference_no" />
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-6 mb-3 px-2">
                                <div class="form-group">
                                    <label class="control-label">{{$t('page.store')}}</label>
                                    <select class="form-control" v-model="form.store" required>
                                        <option value="" hidden>{{$t('page.store')}}</option>
                                        <option :value="item.id" v-for="(item, index) in stores" :key="index">{{item.name}}</option>
                                    </select>
                                    <has-error :form="form" field="store" />
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-6 mb-3 px-2">
                                <div class="form-group">
                                    <label class="control-label">{{$t('page.attachment')}}</label>
                                    <input type="file" class="form-control" @change="handleFile" multiple accept="image/*, application/pdf" />
                                </div>
                            </div>
                            <div class="col-md-6 col-lg-3 mb-3 px-2">
                                <div class="form-group">
                                    <label class="control-label">{{$t('page.shipping_carrier')}}</label>
                                    <input class="form-control" type="text" v-model="form.shipping_carrier" :placeholder="$t('page.shipping_carrier')" />
                                    <has-error :form="form" field="shipping_carrier" />
                                </div>
                            </div>
                            <div class="col-md-12 px-2">
                                <div class="form-group mb-2">
                                    <label class="control-label">{{$t('page.note')}}:</label>
                                    <textarea class="form-control" rows="4" v-model="form.note" :placeholder="$t('page.note')"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="mt-3 text-end">
                            <button type="submit" class="btn btn-primary me-2" :class="{'btn-loading': form.busy}" :disabled="form.busy"><i class="ti-save"></i> {{$t('page.save')}}</button>
                            <router-link :to="{name: 'purchase_order.index'}" class="btn btn-warning"><i class="fe fe-x"></i> {{$t('page.cancel')}}</router-link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Form from "vform";
import Datepicker from 'vuejs-datepicker';
import {mapGetters} from "vuex";
import { directive as viewer } from "v-viewer";
export default {
    middleware: 'auth',
    directives: {
        viewer: viewer({
            debug: true,
        }),
    },
    components: {
        Datepicker,
    },
    data() {
        return {
            product_keyword: '',
            form: new Form({
                id: '',
                reference_no: '',
                store: '',
                shipping_carrier: '',
                images: null,
                items: '',
                total_amount: 0,
                note: '',
            }),
            purchase_items: [],
            initial_orders: [],
            item_images: [],
            customFileName: this.$t('page.choose_file'),

        };
    },
    computed: mapGetters({
        auth_user: 'auth/user',
        stores: 'data/stores',
    }),
    watch: {
        purchase_items: {
            handler(value) {
                this.form.items = JSON.stringify(value.filter(i => i.checked));
                this.form.total_amount = value.filter(i => i.checked).reduce((a, b) => a + parseInt((b.cost - b.discount) * b.receive), 0);
            },
            deep: true,
        },
        product_keyword: function (newVal) {
            this.purchase_items = this.initial_orders.filter(i => i.product.toLowerCase().includes(newVal.toLowerCase()));
        }
    },
    filters: {
        currency: function (value) {
            value = Number(value);
            return value.toLocaleString();
        }
    },
    async mounted() {
        await this.$store.dispatch('data/getStores');
        this.form.id = this.$route.params.id;
        this.loadPurchaseOrder();
        this.getNextReferenceNo();
    },
    methods: {
        loadPurchaseOrder() {
            this.axios.get(`/purchase_order/get_detail/${this.form.id}`).then(response => {
                if (response.data.status == 'Success') {
                    let result = response.data.data;
                    result.items.map(item => {
                        this.purchase_items.push({
                            id: item.id,
                            checked: false,
                            product: item.product,
                            cost: item.cost,
                            discount_string: item.discount_string,
                            discount: item.discount,
                            quantity: item.quantity,
                            received_quantity: item.received_quantity,
                            category: item.category,
                            receive: item.quantity - item.received_quantity,
                        });
                        this.item_images.push({
                            id: item.id,
                            images: item.images
                        });
                    })
                    this.initial_orders = [...this.purchase_items];
                    this.form.store = this.stores.filter(i => i.company_id === result.company_id)[0].id;
                }
            });
        },
        async getNextReferenceNo() {
            const response = await this.axios.get('/purchase/get_next_reference_no');
            this.form.reference_no = response.data.data;
        },
        submit() {
            if (this.purchase_items.filter(i => i.checked).length === 0) {
                return this.$toast.error(this.$t('message.select_product'));
            }
            let uri = '/purchase_order/receive';
            this.form.items = JSON.stringify(this.purchase_items.filter(i => i.checked));
            this.form.total_amount = this.purchase_items.filter(i => i.checked).reduce((a, b) => a + parseInt((b.cost - b.discount) * b.receive), 0);
            this.$isLoading(true);
            this.form.post(uri).then(response => {
                this.$isLoading(false);
                if (response.data.status == 'Success') {
                    this.$toast.success(this.$t('message.successfully_done'));
                    this.$router.push({name: 'purchase.index'});
                }
            });
        },
        handleFile(event) {
            this.form.images = event.target.files;
        },
    }

}
</script>