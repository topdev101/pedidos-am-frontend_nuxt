<template>
    <div class="main-container container-fluid">
        <div class="page-header d-flex">
            <h4 class="page-title mb-0"><i class="ti-palette menu-icon"></i> {{$t('page.dashboard')}}</h4>
            <nav aria-label="breadcrumb mb-0">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="#">{{$t('page.home')}}</a></li>
                    <li class="breadcrumb-item active" aria-current="page">{{$t('page.dashboard')}}</li>
                </ol>
            </nav>
        </div>
        <div class="row">
            <div class="col-12" v-if="data">
                <div class="row">
                    <div class="col-sm-12 col-md-6 col-lg-6 col-xl-3">
                        <div class="card bg-success img-card box-success-shadow">
                            <div class="card-body">
                                <div class="d-flex">
                                    <div>
                                        <h2 class="mb-0 number-font tx-fixed-white">{{data.total_ordered | currency}}</h2>
                                        <p class="tx-fixed-white mb-0">{{$t('page.total_ordered')}}</p>
                                    </div>
                                    <div class="ms-auto">
                                        <i class="fe fe-shopping-cart tx-fixed-white fs-30 me-2 mt-2"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-6 col-xl-3">
                        <div class="card bg-primary img-card box-primary-shadow">
                            <div class="card-body">
                                <div class="d-flex">
                                    <div>
                                        <h2 class="mb-0 number-font tx-fixed-white">{{data.total_received | currency}}</h2>
                                        <p class="tx-fixed-white mb-0">{{$t('page.total_received')}}</p>
                                    </div>
                                    <div class="ms-auto">
                                        <i class="fe fe-truck tx-fixed-white fs-30 me-2 mt-2"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="chart_data" class="col-12">
                <div class="card card-body page-content-card">
                    <div class="filter form-inline">
                        <company-selector v-if="$isAdmin()" v-model="filter.company_id" class="mb-2 me-sm-2" />
                        <date-range-picker ref="daterangepicker"
                            opens="right"
                            class="mb-2 me-sm-2"
                            :showWeekNumbers="false"
                            :showDropdowns="false"
                            :autoApply="false"
                            v-model="dateRange"
                            :linkedCalendars = "true"
                        >
                            <div slot="input" class="daterangepicker-placeholder" slot-scope="picker">
                                <span v-if="dateRange.startDate && dateRange.endDate">{{ $moment(dateRange.startDate).format('YYYY-MM-DD') }} ~ {{ $moment(dateRange.endDate).format('YYYY-MM-DD') }}</span>
                                <span v-else class="text-muted">{{$t('message.select_date_range')}}</span>
                            </div>
                        </date-range-picker>
                        <datepicker
                            v-model="filter.date"
                            input-class="form-control"
                            format="yyyy-MM-dd"
                            :use-utc="true"
                            :typeable="true"
                            :placeholder="$t('page.date')"
                            class="mb-2 me-sm-2 date-filter"
                        ></datepicker>
                        <button type="button" class="btn btn-primary me-2 mb-2" @click="getChartData()"><i class="fe fe-search"></i> {{$t('page.search')}}</button>
                        <button type="button" class="btn btn-danger mb-2" @click="resetFilter()"><i class="fe fe-x"></i> {{$t('page.reset')}}</button>
                    </div>
                    <div class="chart-container mt-4">
                        <dashboard-chart v-if="chart_data"
                            :chart_data="chart_data"
                        ></dashboard-chart>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import DashboardChart from "~/components/chart/DashboardChart";
import CompanySelector from "~/components/ui/CompanySelector";
import Datepicker from 'vuejs-datepicker';
export default {
    middleware: "auth",
    components: {
        DashboardChart,
        CompanySelector,
        DateRangePicker,
        Datepicker,
    },
    head() {
        return { title: this.$t("page.dashboard") };
    },
    data() {
        return {
            data: null,
            chart_data: null,
            dateRange: {
                startDate: '',
                endDate: '',
            },
            filter: {
                company_id: '',
                date: '',
            }
        };
    },
    filters: {
        currency: function (value) {
            value = Number(value);
            return value.toLocaleString();
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        },
    },
    mounted() {
        if (this.auth_user.role != 'admin') this.filter.company_id = this.auth_user.company_id;
        this.loadData();
        this.getChartData();
    },
    methods: {
        async loadData() {
            this.$isLoading(true);
            const response = await this.axios.get('/get_dashboard_data');
            this.$isLoading(false);
            if (response.data.status === 'Success') {
                this.data = response.data.data
            }
        },
        async getChartData() {
            const params = {
                ...this.filter,
                ...this.dateRange
            }
            const response = await this.axios.post('/get_category_chart_data', params);
            if (response.data.status === 'Success') {
                const result = response.data.data;
                this.chart_data = null;
                await this.$nextTick();
                this.chart_data = {
                    keys: result.keys,
                    values: result.values,
                };
            }
        },
        resetFilter() {
            this.dateRange = {
                startDate: '',
                endDate: '',
            };
            this.filter = {
                date: '',
                company_id: this.$isAdmin() ? '' : this.auth_user.company_id,
            };
        }
    }
};
</script>
<style lang="scss" scoped>
    .spinner-border {
        width: 26px;
        height: 26px;
        border-width: 3px;
    }
    .date-filter {
        @media (max-width: 768px) {
            width: 100%;
        }
    }
</style>