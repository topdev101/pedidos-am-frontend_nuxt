<template>
    <div class="main-container container-fluid">
        <div class="page-header">
            <h4 class="page-title mb-0"><i class="mdi mdi-eye-outline menu-icon"></i> {{$t('page.spy')}}</h4>
            <nav aria-label="breadcrumb mb-0">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><router-link :to="{name: 'dashboard'}">{{$t('page.home')}}</router-link></li>
                    <li class="breadcrumb-item"><router-link :to="{name: 'purchase.index'}">{{$t('page.purchase_orders')}}</router-link></li>
                    <li class="breadcrumb-item active" aria-current="page">{{$t('page.spy')}}</li>
                </ol>
            </nav>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card card-body page-content-card">
                    <div v-if="loaded" class="form-inline">
                        <label class="control-label mb-2">{{$t('page.show')}}: </label>
                        <select class="form-control mx-sm-2 mb-2" v-model="filter.per_page" @change="searchFilter()">
                            <option value="15">15</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                            <option value="500">500</option>
                            <option value="1000000">All</option>
                        </select>
                        <company-selector v-model="filter.company_id"
                             :allow-empty="false"
                             class="mb-2"
                        />
                        <multiselect
                            class="mx-sm-2 mb-2"
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
                        <date-range-picker
                            ref="daterangepicker"
                            opens="left"
                            class="mb-2"
                            :showWeekNumbers="false"
                            :showDropdowns="false"
                            :autoApply="false"
                            v-model="dateRange"
                            :placeholder="$t('page.purchase_date')"
                            :linkedCalendars = "true"
                        >
                        <div slot="input" class="daterangepicker-placeholder">
                            <span v-if="dateRange.startDate && dateRange.endDate">{{ $moment(dateRange.startDate).format('YYYY-MM-DD') }} ~ {{ $moment(dateRange.endDate).format('YYYY-MM-DD') }}</span>
                            <span class="text-muted" v-else>{{$t('page.purchase_date')}}</span>
                        </div>
                        </date-range-picker>
                        <input type="text" class="form-control form-control-sm mx-sm-2 mb-2" v-model="filter.keyword" :placeholder="$t('page.keyword')" />
                        <button type="button" class="btn btn-primary mb-2" @click="searchFilter()"><i class="ti-search"></i> {{$t('page.search')}}</button>
                        <button type="button" class="btn btn-danger ms-2 mb-2" @click="resetFilter()"><i class="ti-eraser"></i>{{$t('page.reset')}}</button>
                    </div>
                    <div class="table-responsive" style="min-height: 220px;">
                        <table class="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style="width:40px;">#</th>
                                    <th>
                                        {{$t('page.date')}}
                                        <span class="sort-date float-right">
                                            <i class="ti-angle-up" v-if="filter.sort_by_date == 'desc'" @click="filter.sort_by_date = 'asc'"></i>
                                            <i class="ti-angle-down" v-else @click="filter.sort_by_date = 'desc'"></i>
                                        </span>
                                    </th>
                                    <th>{{$t('page.reference_no')}}</th>
                                    <th>{{$t('page.supplier')}}</th>
                                    <th>{{$t('page.total_amount')}}</th>
                                    <th>{{$t('page.received')}}</th>
                                    <th>{{$t('page.balance')}}</th>
                                    <th>{{$t('page.status')}}</th>
                                    <th width="90">{{$t('page.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="data.length == 0"><td colspan="10" class="text-center">{{$t('page.no_data')}}</td></tr>
                                <tr :class="{'text-danger': item.status == 0}" v-for="(item, index) in data" :key="index">
                                    <td>{{ (filter.page - 1) * filter.per_page + index + 1 }}</td>
                                    <td>{{$moment(item.ordered_at).format('YYYY-MM-DD')}}</td>
                                    <td>{{item.reference_no}}</td>
                                    <td>{{item.supplier ? item.supplier.display_name : ''}}</td>
                                    <td>{{item.total_amount | currency}}</td>
                                    <td>{{item.received_amount | currency}}</td>
                                    <td :class="{'text-danger': item.total_amount < item.received_amount}">
                                        {{(item.total_amount - item.received_amount) | currency}}
                                    </td>
                                    <td>
                                        <span class="badge badge-danger" v-if="item.received_amount == 0">{{$t('page.pending')}}</span>
                                        <span class="badge badge-primary" v-else-if="item.received_amount < item.total_amount">{{$t('page.partial')}}</span>
                                        <span class="badge badge-success" v-else>{{$t('page.completed')}}</span>
                                    </td>
                                    <td class="py-2">
                                        <router-link :to="{name: 'purchase_order.detail', params: {id: item.id}}" class="btn btn-sm btn-primary">{{$t('page.detail')}}</router-link>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colspan="4">{{$t('page.total')}}</th>
                                    <th>{{this.data.reduce((a, b) => a + parseInt(b.total_amount), 0) | currency}}</th>
                                    <th>{{this.data.reduce((a, b) => a + parseInt(b.received_amount), 0) | currency}}</th>
                                    <th>{{this.data.reduce((a, b) => a + parseInt(b.total_amount - b.received_amount), 0) | currency}}</th>
                                    <th colspan="2"></th>
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
            </div>
        </div>
    </div>
</template>
<script>
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import {mapGetters} from "vuex"
import CompanySelector from '~/components/ui/CompanySelector.vue';
export default {
    name: 'SpyPurchaseOrders',
    middleware: 'auth',
    components: {
        DateRangePicker,
        CompanySelector,
    },
    data() {
        return {
            dateRange: {
                startDate: '',
                endDate: '',
            },
            data: [],
            selected_supplier: null,
            filter: {
                page: 1,
                sort_by_date: 'desc',
                per_page: 15,
                company_id: '',
                supplier_id: '',
                keyword: '',
                startDate: '',
                endDate: '',
            },
            total: 0,
            page_count: 0,
            selected_purchase_id: '',
            loaded: false,
        };
    },
    watch: {
        selected_supplier: function (newVal) {
            this.filter.supplier_id = newVal ? newVal.id : '';
        },
        'filter.sort_by_date': function () {
            this.filter.page = 1
            this.searchData();
        }
    },
    computed: mapGetters({
        auth_user: 'auth/user',
        suppliers: 'data/suppliers',
    }),
    filters: {
        currency: function (value) {
            return Number(value).toLocaleString();
        }
    },
    async mounted() {
        setTimeout(() => {
            this.filter.company_id = this.auth_user.company_id;
            this.loaded = true;
        }, 500);
        this.$store.dispatch('data/getSuppliers');
        this.searchData()
    },
    methods: {
        searchData() {
            if (this.dateRange.startDate && this.dateRange.endDate) {
                this.filter.startDate = this.$moment(this.dateRange.startDate).format('YYYY-MM-DD');
                this.filter.endDate = this.$moment(this.dateRange.endDate).format('YYYY-MM-DD');
            }
            let uri = '/purchase_order/search';
            this.$isLoading(true)
            this.axios.get(uri, {params: this.filter}).then(response => {
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
        searchFilter() {
            this.filter.page = 1;
            this.searchData();
        },
        resetFilter() {
            this.filter = {
                page: 1,
                sort_by_date: 'desc',
                per_page: 15,
                company_id: this.auth_user.company_id,
                supplier_id: '',
                keyword: '',
                startDate: '',
                endDate: '',
            }
            this.selected_supplier = null;
            this.dateRange = {
                startDate: '',
                endDate: '',
            };
        },
    }
}
</script>