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
                        <select class="form-control mx-sm-2 mb-2" v-model="filter.per_page" @change="searchFilter()">
                            <option value="15">15</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                            <option value="500">500</option>
                            <option value="1000000">All</option>
                        </select>
                        <company-selector v-if="$isAdmin()" v-model="filter.company_id" class="me-sm-2 mb-2" />
                        <multiselect v-model="selected_supplier"
                            class="me-sm-2 mb-2"
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
                        <date-range-picker ref="daterangepicker"
                            opens="right"
                            class="mb-2"
                            :showWeekNumbers="false"
                            :showDropdowns="false"
                            :autoApply="false"
                            v-model="dateRange"
                            :placeholder="$t('page.purchase_date')"
                            :linkedCalendars = "true"
                        >
                            <div slot="input" class="daterangepicker-placeholder" slot-scope="picker">
                                <span v-if="dateRange.startDate && dateRange.endDate">{{ $moment(dateRange.startDate).format('YYYY-MM-DD') }} ~ {{ $moment(dateRange.endDate).format('YYYY-MM-DD') }}</span>
                                <span class="text-muted" v-else>{{$t('page.purchase_date')}}</span>
                            </div>
                        </date-range-picker>
                        <input type="text" class="form-control form-control-sm mx-sm-2 mb-2" v-model="filter.keyword" :placeholder="$t('page.keyword')" />
                        <button type="button" class="btn btn-primary mb-2" @click="searchFilter()"><i class="fe fe-search"></i> {{$t('page.search')}}</button>
                        <button type="button" class="btn btn-danger ms-2 mb-2" @click="resetFilter()"><i class="fe fe-x"></i> {{$t('page.reset')}}</button>
                    </div>
                    <div class="table-responsive min-height">
                        <table class="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style="width:40px;">#</th>
                                    <th>
                                        {{$t('page.date')}}
                                        <!-- <span class="sort-date float-right">
                                            <i class="ti-angle-up" v-if="filter.sort_by_date == 'desc'" @click="filter.sort_by_date = 'asc'"></i>
                                            <i class="ti-angle-down" v-else @click="filter.sort_by_date = 'desc'"></i>
                                        </span> -->
                                    </th>
                                    <th>{{$t('page.reference_no')}}</th>
                                    <th v-if="auth_user.role === 'admin'">{{$t('page.company')}}</th>
                                    <th>{{$t('page.purchase_order')}}</th>
                                    <th>{{$t('page.supplier')}}</th>
                                    <th>{{$t('page.shipping_carrier')}}</th>
                                    <th>{{$t('page.grand_total')}}</th>
                                    <th width="94">{{$t('page.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="data.length == 0"><td colspan="20" class="text-center">{{$t('page.no_data')}}</td></tr>
                                <tr :class="{'text-danger': item.status == 0}" v-for="(item, index) in data" :key="index">
                                    <td>{{ (filter.page - 1) * filter.per_page + index + 1 }}</td>
                                    <td>
                                        {{$moment(item.purchased_at).format('YYYY-MM-DD')}}
                                    </td>
                                    <td>{{item.reference_no}}</td>
                                    <td v-if="auth_user.role === 'admin'">{{item.company?.name}}</td>
                                    <td>
                                        <router-link v-if="item.purchase_order" :to="{name: 'purchase_order.detail', params: {id: item.purchase_order_id}}" target="_blank">
                                            {{ item.purchase_order?.reference_no }}
                                        </router-link>
                                    </td>
                                    <td>{{item.supplier?.display_name}}</td>
                                    <td>{{item.shipping_carrier}}</td>
                                    <td>{{item.total_amount | currency}}</td>
                                    <td class="py-1" align="center">
                                        <div class="dropdown">
                                            <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown">{{$t('page.action')}}</button>
                                            <ul class="dropdown-menu">
                                                <li><router-link :to="{name: 'purchase.detail', params: {id: item.id}}" class="dropdown-item">{{$t('page.details')}}</router-link></li>
                                                <li><router-link :to="{name: 'purchase.edit', params: {id: item.id}}" class="dropdown-item">{{$t('page.edit')}}</router-link></li>
                                                <li v-if="$hasDeletePermission(item.company_id)"><a href="javascript:;" class="dropdown-item" @click="deletePurchase(item, index)">{{$t('page.delete')}}</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th :colspan="auth_user.role === 'admin' ? 6 : 5">{{$t('page.total')}}</th>
                                    <th>{{this.data.reduce((a, b) => a + parseInt(b.total_amount), 0) | currency}}</th>
                                    <th colspan="10"></th>
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
import 'viewerjs/dist/viewer.css'
import { directive as viewer } from "v-viewer"
import CompanySelector from '~/components/ui/CompanySelector.vue';
export default {
    name: 'PurchaseList',
    middleware: 'auth',
    directives: {
        viewer: viewer({
            debug: true,
        }),
    },
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
            filter: {
                page: 1,
                sort_by_date: 'desc',
                per_page: 15,
                supplier_id: '',
                company_id: '',
                keyword: '',
                startDate: '',
                endDate: '',
            },
            total: 0,
            page_count: 0,
            selected_purchase: '',
            selected_supplier: null,
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
        this.filter.company_id = this.auth_user.role === 'admin' ? '' : this.auth_user.company_id;
        this.$store.dispatch('data/getSuppliers');
        this.searchData()
    },
    beforeDestroy() {
        localStorage.setItem('purchase_filter', JSON.stringify(this.filter))
    },
    methods: {
        searchData() {
            if (this.dateRange.startDate && this.dateRange.endDate) {
                this.filter.startDate = this.$moment(this.dateRange.startDate).format('YYYY-MM-DD');
                this.filter.endDate = this.$moment(this.dateRange.endDate).format('YYYY-MM-DD');
            }
            let uri = '/purchase/search';
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
                supplier_id: '',
                company_id: this.auth_user.role === 'admin' ? '' : this.auth_user.company_id,
                keyword: '',
                startDate: '',
                endDate: '',
            }
            this.selected_supplier = null;
            this.dateRange = {
                startDate: '',
                endDate: '',
            };
            localStorage.removeItem('purchase_filter')
        },
        addPayment(item) {
            this.selected_purchase = item;
            this.$modal.show('payment_modal');
        },
        downloadReport(item) {
            this.$isLoading(true)
            this.axios.get(`/purchase/report/${item.id}`).then(response => {
                this.$isLoading(false)
                if (response.data.status == 'Success') {
                    let result = response.data.data;
                    const url = result.file_url;
                    const link = document.createElement('a');
                    link.setAttribute('href', url);
                    link.setAttribute('target', '_blank');
                    link.setAttribute('download', result.file_name);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            });
        },
        deletePurchase(item, index) {
            Swal.fire({
                icon: 'warning',
                title: this.$t('message.are_you_sure'),
                reverseButtons: true,
                showCancelButton: true,
                confirmButtonText: this.$t('page.ok'),
                cancelButtonText: this.$t('page.cancel')
            }).then((result) => {
                if (result.isConfirmed) {
                    this.axios.delete(`/purchase/delete/${item.id}`).then(response => {
                        if (response.data.status == 'Success') {
                            this.$toast.success(this.$t('message.deleted_successfully'));
                            this.data.splice(index, 1);
                        }
                    })
                }
            })
        },
        paymentAdded(payment) {
            const index = this.data.findIndex(i => i.id === Number(payment.paymentable_id));
            if (index !== false) {
                this.data[index].paid_amount = payment.paymentable.paid_amount;
                this.data[index].paid_amount_cop = payment.paymentable.paid_amount_cop;
            }
        },
        openNotes(item) {
            this.selected_purchase = item;
        },
        addBlNumber(item) {
            this.selected_purchase = item;
            this.$modal.show('bl_number_modal');
        },
        blNumberChanged(data) {
            if (data) {
                const index = this.data.findIndex(i => i.id === data.id);
                if (index !== false) {
                    this.data[index].bl_number = data.bl_number;
                    this.data[index].product = data.product;
                }
            }
            this.selected_purchase = null;
            this.$modal.hide('bl_number_modal');
        },
        changeImportCost(item) {
            this.selected_purchase = item;
            this.$modal.show('import_cost_modal');
        },
        importCostChanged(data) {
            if (data) {
                const index = this.data.findIndex(i => i.id === data.id);
                if (index !== false) {
                    this.data[index] = data;
                }
            }
            this.selected_purchase = null;
            this.$modal.hide('import_cost_modal');
        },
        viewNotes(item) {
            this.selected_purchase = null;
            this.selected_purchase = item;
            this.$modal.show('notes_modal');
        }
    }
}
</script>