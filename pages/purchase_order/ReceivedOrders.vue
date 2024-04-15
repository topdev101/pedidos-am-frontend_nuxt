<template>
    <div class="main-container container-fluid">
        <div class="page-header">
            <h4 class="page-title mb-0"><i class="mdi mdi-truck-check-outline menu-icon"></i> {{$t('page.received_orders')}}</h4>
            <nav aria-label="breadcrumb mb-0">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><router-link :to="{name: 'dashboard'}">{{$t('page.home')}}</router-link></li>
                    <li class="breadcrumb-item"><router-link :to="{name: 'purchase.index'}">{{$t('page.received_orders')}}</router-link></li>
                    <li class="breadcrumb-item active" aria-current="page">{{$t('page.list')}}</li>
                </ol>
            </nav>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card card-body page-content-card">
                    <div class="form-inline">
                        <label class="control-label mb-2">{{$t('page.show')}}: </label>
                        <select class="form-control form-control-sm mx-sm-2 mb-2" v-model="filter.per_page" @change="searchFilter()">
                            <option value="15">15</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                            <option value="500">500</option>
                            <option value="1000000">All</option>
                        </select>
                        <select class="form-control form-control-sm mb-2" v-model="filter.company_id" v-if="auth_user.role == 'admin'">
                            <option value="" hidden>{{$t('message.select_company')}}</option>
                            <option :value="item.id" v-for="(item, index) in companies" :key="index">{{item.name}}</option>
                        </select>
                        <multiselect
                            class="mx-sm-2 mb-2"
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
                        <button type="button" class="btn btn-danger ml-2 mb-2" @click="resetFilter()"><i class="ti-eraser"></i>{{$t('page.reset')}}</button>
                    </div>
                    <div class="table-responsive">
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
                                    <th>{{$t('page.purchase_status')}}</th>
                                    <th>{{$t('page.grand_total')}}</th>
                                    <th>{{$t('page.paid')}}</th>
                                    <th>{{$t('page.balance')}}</th>
                                    <th>{{$t('page.payment_status')}}</th>
                                    <th width="100">{{$t('page.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="data.length == 0"><td colspan="10" class="text-center">{{$t('page.no_data')}}</td></tr>
                                <tr v-for="(item, index) in data" :key="index">
                                    <td>{{ (filter.page - 1) * filter.per_page + index + 1 }}</td>
                                    <td>{{$moment(item.purchased_at).format('YYYY-MM-DD')}}</td>
                                    <td>{{item.reference_no}}</td>
                                    <td>{{item.supplier ? item.supplier.company : ''}}</td>
                                    <td class="status">
                                        <span class="badge badge-success" v-if="item.status == 1">{{$t('page.received')}}</span>
                                        <span class="badge badge-primary" v-else>{{$t('page.pending')}}</span>
                                    </td>
                                    <td>{{item.grand_total | currency}}</td>
                                    <td>{{item.paid_amount | currency}}</td>
                                    <td>
                                        {{(item.grand_total - item.paid_amount) | currency}}
                                    </td>
                                    <td>
                                        <span class="badge badge-danger" v-if="item.paid_amount == 0">{{$t('page.pending')}}</span>
                                        <span class="badge badge-primary" v-else-if="item.paid_amount < item.grand_total">{{$t('page.partial')}}</span>
                                        <span class="badge badge-success" v-else>{{$t('page.received')}}</span>
                                    </td>
                                    <td class="py-2" align="center">
                                        <div class="btn-group">
                                            <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-toggle="dropdown">{{$t('page.action')}}</button>
                                            <ul class="dropdown-menu">
                                                <li><router-link :to="{name: 'purchase_order.detail', params: {id: item.id}}" class="dropdown-item">{{$t('page.details')}}</router-link></li>
                                                <li><router-link :to="{name: 'purchase_order.edit', params: {id: item.id}}" class="dropdown-item">{{$t('page.edit')}}</router-link></li>
                                                <li><a href="javascript:;" class="dropdown-item" @click="deletePreOrder(item, index)">{{$t('page.delete')}}</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colspan="5">{{$t('page.total')}}</th>
                                    <th>{{footer_grand_total | currency}}</th>
                                    <th>{{footer_received | currency}}</th>
                                    <th>{{footer_grand_total - footer_received | currency}}</th>
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
import Swal from 'sweetalert2'
import {mapGetters} from "vuex"
export default {
    middleware: 'auth',
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
            filter: {
                page: 1,
                sort_by_date: 'desc',
                per_page: 15,
                order_id: '',
                company_id: '',
                supplier_id: '',
                keyword: '',
                startDate: '',
                endDate: '',
            },
            total: 0,
            page_count: 0,
            footer_grand_total: 0,
            footer_received: 0,
            selected_purchase_id: '',
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
        companies: 'data/companies',
        suppliers: 'data/suppliers',
    }),
    filters: {
        currency: function (value) {
            return value.toLocaleString();
        }
    },
    mounted() {
        this.$store.dispatch('data/getSuppliers');
        if (this.$route.params.order_id) {
            this.filter.order_id = this.$route.params.order_id;
        }
        this.searchData()
    },
    methods: {
        searchData() {
            if (this.dateRange.startDate && this.dateRange.endDate) {
                this.filter.startDate = this.$moment(this.dateRange.startDate).format('YYYY-MM-DD');
                this.filter.endDate = this.$moment(this.dateRange.endDate).format('YYYY-MM-DD');
            }
            let uri = '/received_order/search';
            this.$isLoading(true)
            this.axios.post(uri, this.filter).then(response => {
                this.$isLoading(false)
                if (response.data.status == 'Success') {
                    let result = response.data.data;
                    this.data = result.data;
                    this.filter.per_page = result.per_page;
                    this.page_count = result.last_page;
                    this.total = result.total;

                    this.footer_grand_total = this.data.reduce((a, b) => a + parseFloat(b.grand_total), 0);
                    this.footer_received = this.data.reduce((a, b) => a + parseFloat(b.paid_amount), 0);
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
                company_id: '',
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
        deletePreOrder(item, index) {
            Swal.fire({
                icon: 'warning',
                title: this.$t('message.are_you_sure'),
                reverseButtons: true,
                showCancelButton: true,
                confirmButtonText: this.$t('page.ok'),
                cancelButtonText: this.$t('page.cancel')
            }).then((result) => {
                if (result.isConfirmed) {
                    this.axios.get(`/purchase/delete/${item.id}`).then(response => {
                        if (response.data.status == 'Success') {
                            this.$toast.success(this.$t('message.deleted_successfully'));
                            this.data.splice(index, 1);
                        }
                    })
                }
            })
        }
    }
}
</script>