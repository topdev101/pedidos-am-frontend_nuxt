<template>
    <div class="card card-body page-content-card">
        <div class="form-inline">
            <label class="control-label mb-2">{{$t('page.show')}}: </label>
            <select class="form-control mx-sm-2 mb-2" v-model="filter.per_page" @change="searchFilter()">
                <option value="15">15</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="500">500</option>
                <option value="1000000">All</option>
            </select>
            <multiselect v-if="!supplier_id && type === 'purchase'"
                class="ms-sm-2 mb-2"
                v-model="selected_supplier"
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
            <multiselect v-if="!customer_id && type === 'sale'"
                class="ms-sm-2 mb-2"
                v-model="selected_customer"
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
            <date-range-picker
                ref="daterangepicker"
                opens="left"
                class="ms-2 mb-2"
                :showWeekNumbers="false"
                :showDropdowns="false"
                :autoApply="false"
                v-model="dateRange"
                :placeholder="$t('page.date')"
                :linkedCalendars = "true"
            >
                <div slot="input" class="daterangepicker-placeholder">
                    <span v-if="dateRange.startDate && dateRange.endDate">{{ $moment(dateRange.startDate).format('YYYY-MM-DD') }} ~ {{ $moment(dateRange.endDate).format('YYYY-MM-DD') }}</span>
                    <span class="text-muted" v-else>{{$t('page.date')}}</span>
                </div>
            </date-range-picker>
            <input type="text" class="form-control form-control-sm mx-sm-2 mb-2" v-model="filter.keyword" :placeholder="$t('page.keyword')" />
            <button type="button" class="btn btn-primary mb-2" @click="searchFilter()"><i class="fe fe-search"></i> {{$t('page.search')}}</button>
            <button type="button" class="btn btn-danger ms-2 mb-2" @click="resetFilter()"><i class="fe fe-x"></i> {{$t('page.reset')}}</button>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th style="width:40px;">#</th>
                        <th>{{$t('page.date')}}</th>
                        <th>{{$t('page.reference_no')}}</th>
                        <th>
                            <span v-if="type == 'purchase' || supplier_id">{{$t('page.purchase_reference')}}</span>
                            <span v-if="type == 'sale' || customer_id">{{$t('page.sale_reference')}}</span>
                        </th>
                        <th>
                            <span v-if="type == 'purchase' || supplier_id">{{$t('page.supplier')}}</span>
                            <span v-if="type == 'sale' || customer_id">{{$t('page.customer')}}</span>
                        </th>
                        <th>{{$t('page.amount')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="data.length == 0"><td colspan="15" class="text-center">{{$t('page.no_data')}}</td></tr>
                    <tr v-for="(item, index) in data" :key="index">
                        <td>{{ (filter.page - 1) * filter.per_page + index + 1 }}</td>
                        <td>{{$moment(item.paid_at).format('YYYY-MM-DD')}}</td>
                        <td>{{item.reference_no}}</td>
                        <td>{{item.paymentable.reference_no}}</td>
                        <td>
                            <span v-if="item.paymentable.supplier">{{item.paymentable.supplier?.company}}</span>
                            <span v-else-if="item.paymentable.customer">{{item.paymentable.customer?.company}}</span>
                        </td>
                        <td>
                            {{item.amount | currency}} USD
                            /
                            {{item.amount_cop | currency}} COP
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="5">{{$t('page.total')}}</th>
                        <th colspan="2">
                            {{data.reduce((a, b) => a + parseInt(b.amount), 0) | currency}} USD
                            /
                            {{data.reduce((a, b) => a + parseInt(b.amount_cop), 0) | currency}} COP
                        </th>
                    </tr>
                </tfoot>
            </table>
            <div class="d-flex justify-content-between align-items-center mt-2">
                <div>
                    <p>{{$t('page.total')}} <strong style="color: red">{{ total }}</strong> {{$t('page.items')}}</p>
                </div>
                <div>
                    <paginate
                        v-model="filter.page"
                        :page-count="page_count"
                        :page-range="3"
                        :margin-pages="2"
                        :prev-class="'page-item'"
                        :next-class="'page-item'"
                        :prev-link-class="'page-link'"
                        :next-link-class="'page-link'"
                        :click-handler="searchData"
                        :container-class="'pagination'"
                        :page-class="'page-item'"
                        :prev-text="'<'"
                        :next-text="'>'"
                        :page-link-class="'page-link'">
                    </paginate>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import {mapGetters} from "vuex"
export default {
    props: ['type', 'supplier_id', 'customer_id'],
    components: {
        DateRangePicker,
    },
    data() {
        return {
            dateRange: {
                startDate: '',
                endDate: '',
            },
            data: [],
            selected_supplier: null,
            selected_customer: null,
            filter: {
                type: this.type,
                page: 1,
                per_page: 15,
                supplier_id: this.supplier_id,
                customer_id: this.customer_id,
                keyword: '',
                startDate: '',
                endDate: '',
            },
            total: 0,
            page_count: 0,
            suppliers: [],
            customers: [],
        };
    },
    watch: {
        selected_supplier: function (newVal) {
            this.filter.supplier_id = newVal ? newVal.id : '';
        },
        selected_customer: function (newVal) {
            this.filter.customer_id = newVal ? newVal.id : '';
        },
    },
    computed: mapGetters({
        auth_user: 'auth/user',
    }),
    filters: {
        currency: function (value) {
            return value.toLocaleString();
        }
    },
    mounted() {
        this.getSuppliers();
        this.getCustomers();
        this.searchData();
    },
    methods: {
        searchData() {
            if (this.dateRange.startDate && this.dateRange.endDate) {
                this.filter.startDate = this.$moment(this.dateRange.startDate).format('YYYY-MM-DD');
                this.filter.endDate = this.$moment(this.dateRange.endDate).format('YYYY-MM-DD');
            }
            let uri = '/report/payments_report';
            this.$isLoading(true)
            this.axios.post(uri, this.filter).then(response => {
                this.$isLoading(false)
                if (response.data.status == 'Success') {
                    let result = response.data.data;
                    this.data = result.data;
                    this.filter.per_page = result.per_page;
                    this.page_count = result.last_page;
                    this.total = result.total;
                }
            });
        },
        async getSuppliers() {
            const response = await this.axios.get('/get_suppliers');
            this.suppliers = response.data.data;
        },
        async getCustomers() {
            const response = await this.axios.get('/get_customers');
            this.customers = response.data.data;
        },
        searchFilter() {
            this.filter.page = 1;
            this.searchData();
        },
        resetFilter() {
            this.filter = {
                type: this.type,
                page: 1,
                per_page: 15,
                supplier_id: this.supplier_id,
                customer_id: this.customer_id,
                keyword: '',
                startDate: '',
                endDate: '',
            }
            this.selected_supplier = null;
            this.selected_customer = null;
            this.dateRange = {
                startDate: '',
                endDate: '',
            };
        },
    }
}
</script>