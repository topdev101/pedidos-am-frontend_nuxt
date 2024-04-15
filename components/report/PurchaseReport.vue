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
            <multiselect
                class="ms-sm-2 mb-2"
                v-model="selected_supplier"
                :options="suppliers"
                :multiple="false"
                :preserve-search="true"
                :placeholder="$t('message.select_supplier')"
                label="company"
                track-by="id"
                :show-labels="false"
                v-if="!supplier_id"
            >
                <span slot="noOptions" class="no_option_slot d-none"></span>
            </multiselect>
            <date-range-picker
                ref="daterangepicker"
                opens="left"
                class="ms-sm-2 mb-2"
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
                        <th>{{$t('page.vehicle_reference')}}</th>
                        <th>{{$t('page.vehicle')}}</th>
                        <th>{{$t('page.bl_number')}}</th>
                        <th>{{$t('page.supplier')}}</th>

                        <th v-if="custom_agent_id">{{$t('page.tax')}}</th>
                        <th v-if="!custom_agent_id">{{$t('page.total')}}</th>
                        <th>{{$t('page.paid')}}</th>
                        <th>{{$t('page.balance')}}</th>

                        <th>{{$t('page.status')}}</th>
                        <th>{{$t('page.country')}}</th>
                        <th>{{$t('page.import_type')}}</th>
                        <th>{{$t('page.estimated_date')}}</th>
                        <th v-if="custom_agent_id">{{$t('page.action')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="data.length == 0"><td colspan="15" class="text-center">{{$t('page.no_data')}}</td></tr>
                    <tr :class="{'text-danger': item.status == 0}" v-for="(item, index) in data" :key="index">
                        <td>{{ (filter.page - 1) * filter.per_page + index + 1 }}</td>
                        <td>
                            {{$moment(item.purchased_at).format('YYYY-MM-DD')}}
                        </td>
                        <td>{{item.reference_no}}</td>
                        <td>{{item.product.reference}}</td>
                        <td>{{item.product.brand}} ( {{item.product.vin}} / {{item.product.engine_number}} )</td>
                        <td>{{item.bl_number}}</td>
                        <td>{{item.supplier?.company}}</td>
                        <template v-if="custom_agent_id">
                            <td>
                                <span class="value-cop">{{item.custom_taxes | currency}} USD</span>
                                /
                                <span class="value-usd">{{item.custom_taxes_cop | currency}} COP</span>
                            </td>
                            <td>
                                <span class="value-cop">{{item.tax_paid_amount | currency}} USD</span>
                                /
                                <span class="value-usd">{{item.tax_paid_amount_cop | currency}} COP</span>
                            </td>
                            <td>
                                <span class="value-cop">{{(item.custom_taxes - item.tax_paid_amount) | currency}} COP</span>
                                /
                                <span class="value-usd">{{(item.custom_taxes_cop - item.tax_paid_amount_cop) | currency}} USD</span>
                            </td>
                        </template>
                        <template v-if="!custom_agent_id">
                            <td>
                                <span class="value-cop">{{item.total_cost | currency}} USD</span>
                                /
                                <span class="value-usd">{{item.total_cost_cop | currency}} COP</span>
                            </td>
                            <td>
                                <span class="value-cop">{{item.paid_amount | currency}} USD</span>
                                /
                                <span class="value-usd">{{item.paid_amount_cop | currency}} COP</span>
                            </td>
                            <td>
                                <span class="value-cop">{{(item.total_cost - item.paid_amount) | currency}} USD</span>
                                /
                                <span class="value-usd">{{(item.total_cost_cop - item.paid_amount_cop) | currency}} COP</span>
                            </td>
                        </template>
                        <td>
                            <span :class="{
                                    'badge': true,
                                    'badge-primary': item.product.product_status === 'in_the_city_of_purchase',
                                    'badge-secondary': item.product.product_status === 'in_destination_port',
                                    'badge-info': item.product.product_status === 'in_sale_window',
                                    'badge-warning': item.product.product_status === 'on_the_way',
                                    'badge-success': item.product.product_status === 'sold',
                                }"
                            >
                                {{ $t(`page.${item.product.product_status}`) }}
                            </span>
                        </td>
                        <td>{{item.supplier?.country?.name}}</td>
                        <td>
                            <span v-if="item.import_type === 'direct'">{{$t('page.direct_import')}}</span>
                            <span v-else>{{ item.import_company }}</span>
                        </td>
                        <td>
                            <span v-if="item.estimated_date">{{$moment(item.estimated_date).format('YYYY-MM-DD')}}</span>
                        </td>
                        <td v-if="custom_agent_id" class="py-1" align="center">
                            <div class="dropdown">
                                <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown">{{$t('page.action')}}</button>
                                <ul class="dropdown-menu">
                                    <li><router-link :to="{name: 'payment.index', params: {model: 'purchase', id: item.id}, query: {type: 'custom_taxes'}}" class="dropdown-item">{{$t('page.payment_list')}}</router-link></li>
                                    <li><a href="javascript:;" class="dropdown-item" @click="addPayment(item)">{{$t('page.add_payment')}}</a></li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="7">{{$t('page.total')}}</th>
                        <template v-if="custom_agent_id">
                            <th>
                                <span class="value-cop">{{footer_custom_taxes | currency}} COP</span>
                                /
                                <span class="value-usd">{{Math.round(footer_custom_taxes_cop) | currency}} USD</span>
                            <th>
                                <span class="value-cop">{{footer_tax_paid | currency}} COP</span>
                                /
                                <span class="value-usd">{{Math.round(footer_tax_paid_cop) | currency}} USD</span>
                            </th>
                            <th>
                                <span class="value-cop">{{(footer_custom_taxes - footer_tax_paid) | currency}} COP</span>
                                /
                                <span class="value-usd">{{Math.round(footer_custom_taxes_cop - footer_tax_paid_cop) | currency}} USD</span>
                            </th>
                        </template>
                        <template v-if="!custom_agent_id">
                            <th>
                                <span class="value-cop">{{footer_grand_total | currency}} COP</span>
                                /
                                <span class="value-usd">{{Math.round(footer_grand_total_cop) | currency}} USD</span>
                            <th>
                                <span class="value-cop">{{footer_paid | currency}} COP</span>
                                /
                                <span class="value-usd">{{Math.round(footer_paid_cop) | currency}} USD</span>
                            </th>
                            <th>
                                <span class="value-cop">{{(footer_grand_total - footer_paid) | currency}} COP</span>
                                /
                                <span class="value-usd">{{Math.round(footer_grand_total_cop - footer_paid_cop) | currency}} USD</span>
                            </th>
                        </template>
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
        <ui-modal name="payment_modal"
            :title="$t('page.add_payment')"
            :click-to-close="false"
        >
            <payment-form v-if="selected_purchase"
                mode="add"
                model="purchase"
                type="custom_taxes"
                :paymentable_id="selected_purchase.id"
                :balance="paymentBalance"
                @submit="paymentAdded"
            />
        </ui-modal>
    </div>
</template>
<script>
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
export default {
    props: ['supplier_id', 'custom_agent_id'],
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
            suppliers: [],
            selected_supplier: null,
            filter: {
                page: 1,
                sort_by_date: 'desc',
                per_page: 15,
                company_id: '',
                supplier_id: this.supplier_id,
                custom_agent_id: this.custom_agent_id,
                keyword: '',
                startDate: '',
                endDate: '',
            },
            total: 0,
            page_count: 0,
            selected_purchase: '',
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
    computed: {
        paymentBalance() {
            if (!this.selected_purchase) return 0;
            if (this.custom_agent_id) {
                return this.selected_purchase.custom_taxes - this.selected_purchase.tax_paid_amount;
            } else {
                return this.selected_purchase.total_cost - this.selected_purchase.paid_amount;
            }
        },
        auth_user() {
            return this.$store.getters['auth/user'];
        },
        footer_grand_total() {
            return this.data.reduce((a, b) => a + parseInt(b.total_cost), 0);
        },
        footer_grand_total_cop() {
            return this.data.reduce((a, b) => a + parseInt(b.total_cost_cop), 0);
        },
        footer_paid() {
            return this.data.reduce((a, b) => a + parseInt(b.paid_amount), 0);
        },
        footer_paid_cop() {
            return this.data.reduce((a, b) => a + parseInt(b.paid_amount * b.exchange_rate), 0);
        },
        footer_custom_taxes() {
            return this.data.reduce((a, b) => a + parseInt(b.custom_taxes), 0);
        },
        footer_custom_taxes_cop() {
            return this.data.reduce((a, b) => a + parseInt(b.custom_taxes_cop), 0);
        },
        footer_tax_paid() {
            return this.data.reduce((a, b) => a + parseInt(b.tax_paid_amount), 0);
        },
        footer_tax_paid_cop() {
            return this.data.reduce((a, b) => a + parseInt(b.tax_paid_amount_cop), 0);
        },
    },
    filters: {
        currency: function (value) {
            return Number(value).toLocaleString();
        }
    },
    mounted() {
        this.getSuppliers();
        this.searchData()
    },
    methods: {
        searchData() {
            if (this.dateRange.startDate && this.dateRange.endDate) {
                this.filter.startDate = this.$moment(this.dateRange.startDate).format('YYYY-MM-DD');
                this.filter.endDate = this.$moment(this.dateRange.endDate).format('YYYY-MM-DD');
            }
            let uri = '/report/purchases_report';
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
                supplier_id: this.supplier_id,
                custom_agent_id: this.custom_agent_id,
                user_id: this.user_id,
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
        addPayment(item) {
            this.selected_purchase = item;
            this.$modal.show('payment_modal');
        },
        paymentAdded(payment) {
            const index = this.data.findIndex(i => i.id === Number(payment.paymentable_id));
            if (index !== false) {
                this.data[index].paid_amount = payment.paymentable.paid_amount;
                this.data[index].tax_paid_amount = payment.paymentable.tax_paid_amount;
            }
        },
    }
}
</script>