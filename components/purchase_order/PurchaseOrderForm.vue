<template>
    <form @submit.prevent="submit" @keydown="form.onKeydown($event)">
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label class="control-label">{{$t('page.date')}}</label>
                    <datepicker
                        v-model="form.date"
                        input-class="form-control"
                        format="yyyy-MM-dd"
                        :use-utc="true"
                        :typeable="true"
                        :placeholder="$t('page.date')"
                    ></datepicker>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="control-label">{{$t('page.reference_no')}}</label>
                    <input class="form-control" type="text" v-model="form.reference_no" required :placeholder="$t('page.reference_no')" />
                    <has-error :form="form" field="reference_no" />
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="form-group">
                    <label class="control-label">{{$t('page.supplier')}}</label>
                    <div class="input-group">
                        <multiselect
                            v-model="selected_supplier"
                            :options="suppliers"
                            :multiple="false"
                            :preserve-search="true"
                            :placeholder="$t('message.select_supplier')"
                            label="display_name"
                            track-by="id"
                            :show-labels="false"
                        >
                            <span slot="noOptions" class="no_option_slot d-none"></span>
                        </multiselect>
                        <div class="input-group-append">
                            <button type="button" class="btn btn-primary" @click="$modal.show('supplier_modal')"><i class="ti-plus"></i></button>
                        </div>
                    </div>
                    <has-error :form="form" field="supplier" />
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="form-group">
                    <label class="control-label">{{$t('page.attachment')}}</label>
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="customFile" multiple @change="handleFile" accept="image/*" />
                        <label class="custom-file-label" for="customFile">{{customFileName}}</label>
                    </div>
                    <div v-if="mode == 'edit' && images.length" class="mt-1">
                        <delete-image :images="images"></delete-image>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="form-group">
                    <label class="control-label">{{$t('page.discount')}}</label>
                    <input class="form-control" type="text" v-model="form.discount" required :placeholder="$t('page.discount')" />
                    <has-error :form="form" field="discount" />
                </div>
            </div>
            <div class="col-12 mb-3">
                <div class="mb-2 d-flex align-items-center">
                    <h4 class="mb-0">{{$t('page.order_items')}}</h4>
                </div>
                <div class="items-table-container">
                    <table class="table table-bordered" id="product_table">
                        <thead class="table-primary">
                            <tr>
                                <th style="min-width:180px;">{{$t('page.product')}}</th>
                                <th style="width: 140px;min-width:140px;">{{$t('page.cost')}}</th>
                                <th style="width: 100px;min-width:100px;">{{$t('page.quantity')}}</th>
                                <th style="width: 100px;min-width:100px;">{{$t('page.discount')}}</th>
                                <th>{{$t('page.image')}}</th>
                                <th style="width: 250px;min-width:250px;">{{$t('page.category')}}</th>
                                <th>{{$t('page.subtotal')}}</th>
                                <th style="width:30px"></th>
                            </tr>
                        </thead>
                        <tbody class="top-search-form">
                            <tr v-for="(item, index) in orderItems" :key="index">
                                <td class="p-1">
                                    <input type="text" class="form-control form-control-sm" v-model="item.product" :placeholder="$t('page.product')" required />
                                </td>
                                <td class="p-1">
                                    <input type="number" class="form-control form-control-sm" v-model="item.cost" required :placeholder="$t('page.product_cost')" />
                                </td>
                                <td class="p-1">
                                    <input type="number" class="form-control form-control-sm" v-model="item.quantity" required :placeholder="$t('page.quantity')" />
                                </td>
                                <td class="p-1">
                                    <input type="text" class="form-control form-control-sm" v-model="item.discount_string" :placeholder="$t('page.discount')" />
                                </td>
                                <td class="p-1">
                                    <input type="file" class="form-control form-control-sm" multiple accept="image/*" @change="addItemImages($event, index)" />
                                </td>
                                <td class="p-1">
                                    <multiselect v-model="selected_categories[index]"
                                        :options="categories"
                                        :multiple="false"
                                        :preserve-search="true"
                                        :placeholder="$t('message.select_category')"
                                        label="name"
                                        track-by="id"
                                        open-direction="bottom"
                                        :show-labels="false"
                                    >
                                        <span slot="noOptions" class="no_option_slot d-none"></span>
                                    </multiselect>
                                </td>
                                <td class="subtotal">
                                    {{(item.cost - item.discount) * item.quantity | currency}}
                                </td>
                                <td>
                                    <a href="javascript:;" class="text-danger btn-remove" @click="removeItem(index)"><i class="ti-close"></i></a>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colspan="2">{{$t('page.total')}}</th>
                                <th>{{orderItems.reduce((a, b) => a + parseFloat(b.quantity), 0)}}</th>
                                <th colspan="3"></th>
                                <th colspan="2" class="total">{{orderItems.reduce((a, b) => a + (parseFloat(b.cost - b.discount) * b.quantity), 0) | currency}}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="d-flex justify-content-end">
                    <a href="javascript:;" class="btn btn-sm btn-primary ms-auto" @click="addItem()">
                        <i class="ti-plus"></i>
                    </a>
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
            <button type="submit" class="btn btn-primary me-2" :class="{'btn-loading': form.busy}" :disabled="form.busy"><i class="ti-save"></i> {{$t('page.save')}}</button>
            <router-link :to="{name: 'purchase_order.index'}" class="btn btn-warning"><i class="ti-close"></i> {{$t('page.cancel')}}</router-link>
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
import {mapGetters} from "vuex"
import axios from "axios";
export default {
    props: ['mode', 'id'],
    components: {
        Datepicker,
        SupplierForm,
        DeleteImage
    },
    data() {
        return {
            selected_supplier: null,
            form: new Form({
                id: '',
                date: this.$moment().format('YYYY-MM-DD'),
                reference_no: '',
                supplier: '',
                discount: '',
                images: null,
                items: '',
                total_amount: 0,
                note: '',
            }),
            orderItems: [],
            customFileName: this.$t('page.choose_file'),
            images: [],
            selected_categories: [],
        };
    },
    computed: mapGetters({
        auth_user: 'auth/user',
        companies: 'data/companies',
        suppliers: 'data/suppliers',
        categories: 'data/categories',
    }),
    watch: {
        selected_supplier: function (newVal) {
            this.form.supplier = newVal ? newVal.id : '';
            if (newVal) {
                this.form.discount = newVal.discount;
            }
        },
        orderItems: {
            handler: function(value) {
                this.calcGrandTotal();
                this.form.items = JSON.stringify(value);
            },
            deep: true
        },
        selected_categories: {
            handler: function(value) {
                this.orderItems.map((item, index) => {
                    item.category_id = value[index] ? value[index].id : '';
                })
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
        this.$store.dispatch('data/getSuppliers');
        this.$store.dispatch('data/getCategories');
        this.form.store = this.auth_user.first_store_id;
        if (this.mode == 'edit') {
            this.loadPurcahseOrder();
        } else {
            this.getNextReferenceNo();
        }
    },
    methods: {
        loadPurcahseOrder() {
            this.axios.get(`/purchase_order/get_detail/${this.id}`).then(response => {
                if (response.data.status == 'Success') {
                    let purchase_order = response.data.data;
                    this.form.id = purchase_order.id;
                    this.form.date = this.$moment(purchase_order.ordered_at).format('YYYY-MM-DD');
                    this.form.reference_no = purchase_order.reference_no;
                    this.form.supplier = purchase_order.supplier_id;
                    this.form.note = purchase_order.note;
                    this.orderItems = purchase_order.items;

                    this.selected_supplier = purchase_order.supplier
                    this.form.discount = purchase_order.discount;

                    this.images = purchase_order.images;
                    purchase_order.items.map(item => {
                        this.selected_categories.push(item.category);
                    });
                }
            });
        },
        async getNextReferenceNo() {
            const response = await this.axios.get('/purchase_order/get_next_reference_no');
            this.form.reference_no = response.data.data;
        },
        async submit() {
            if (this.orderItems.find(i => i.category_id == '')) {
                return this.$toast.error(this.$t('message.select_category'));
            }
            if (this.$isSecretary() && !this.checkDiscount()) {
                return this.$toast.error(this.$t('message.you_cant_decrease_discount', {discount: this.form.discount}));
            }
            let uri = this.mode == 'edit' ? '/purchase_order/update' : '/purchase_order/create';
            this.$isLoading(true);
            const data = {
                busy:this.form.busy,
                date:this.form.date,
                discount:this.form.discount,
                errors:this.form.errors,
                id:this.form.id,
                items:this.form.items,
                note:this.form.note,
                originalData:this.form.originalData,
                progress:this.form.progress,
                recentlySuccessful:this.form.recentlySuccessful,
                recentlySuccessfulTimeoutId:this.form.recentlySuccessfulTimeoutId,
                reference_no:this.form.reference_no,
                store:this.form.store,
                successful:this.form.successful,
                supplier:this.form.supplier,
                total_amount:this.form.total_amount
            }
            await axios.post(uri,data).then(response => {
                this.$isLoading(false);
                this.form.id = response.data.data.id;
                if (response.data.status == 'Success') {
                    this.$toast.success(this.$t('message.successfully_done'));
                }
            });
            // this.$store.dispatch('uploadImage',this.form);
            this.form.post('/purchase_order/upload_image').then(res=>this.$toast.success("Order item image")).catch(err => console.log(err));
            this.$router.push({name: 'purchase_order.index'});
        },
        handleFile(event) {
            var fileName = event.target.value.split("\\").pop();
            this.customFileName = fileName;
            this.form.images = event.target.files;
        },
        addItemImages(event, index) {
            this.form[`item_images_${index}`] = event.target.files;
        },
        closeModal(modalId) {
            this.$modal.hide(modalId);
        },
        customProductLabel({name, code}) {
            return `${name}(${code})`
        },
        addItem() {
            if (!this.selected_supplier) {
                return this.$toast.error(this.$t('message.select_supplier'));
            }
            let lastItem = this.orderItems[this.orderItems.length - 1];

            this.orderItems.push({
                product: lastItem ? lastItem.product : '',
                category_id: lastItem ? lastItem.category_id : '',
                cost: lastItem ? lastItem.cost : 0,
                quantity: lastItem ? lastItem.quantity : 0,
                discount_string: this.form.discount,
                discount: 0,
                amount: 0,
            });
            const category = lastItem && lastItem.category_id ? this.categories.find(i => i.id === lastItem.category_id) : null;
            this.selected_categories.push(category);
        },
        removeItem(index) {
            this.orderItems.splice(index, 1);
            this.selected_categories.splice(index, 1);
            this.form[`item_images_${index}`] = null;
        },
        calcDiscount(){
            let reg_patt1 = /^\d+(?:\.\d+)?%$/
            let reg_patt2 = /^\d+$/
            this.orderItems.map(item => {
                if(reg_patt1.test(item.discount_string)){ // Percentage
                    item.discount = item.cost * parseInt(item.discount_string) / 100
                } else if (reg_patt2.test(item.discount_string)){ // Fixed
                    item.discount = parseInt(item.discount_string)
                } else if (this.discount_string == ''){
                    item.discount = 0
                } else {
                    item.discount_string = '';
                    item.discount = 0
                }
            })
        },
        addSupplier(data) {
            this.$store.dispatch('data/getSuppliers');
            this.selected_supplier = data;
            this.$modal.hide('supplier_modal');
        },
        calcGrandTotal() {
            this.calcDiscount()
            this.form.total_amount = this.orderItems.reduce((a, b) => a + parseInt((b.cost - b.discount) * b.quantity), 0);
        },
        checkDiscount() {
            let reg_patt1 = /^\d+(?:\.\d+)?%$/
            let reg_patt2 = /^\d+$/
            for (let index = 0; index < this.orderItems.length; index++) {
                const item = this.orderItems[index];
                let itemDiscount = 0;
                let supplierDiscount = 0;
                if(reg_patt1.test(item.discount_string)) { // Percentage
                    itemDiscount = item.cost * parseInt(item.discount_string) / 100;
                } else if (reg_patt2.test(item.discount_string)){ // Fixed
                    itemDiscount = parseInt(item.discount_string)
                }
                if(reg_patt1.test(this.form.discount)) { // Percentage
                    supplierDiscount = item.cost * parseInt(this.form.discount) / 100;
                } else if (reg_patt2.test(this.form.discount)) { // Fixed
                    supplierDiscount = parseInt(this.form.discount)
                }
                if (itemDiscount < supplierDiscount) {
                    return false; // Discount has less than supplier's
                }
            }
            return true; //Discounts are greater than supplier's
        }
    }

}
</script>
<style lang="scss" scoped>
    .btn-remove {
        display: block;
        border-radius: 100%;
    }
    .items-table-container {
        @media (max-width: 768px) {
            overflow-x: auto;
            min-height: 250px;
        }
    }
</style>