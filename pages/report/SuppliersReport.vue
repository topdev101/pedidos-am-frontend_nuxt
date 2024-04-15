<template>
    <div class="main-container container-fluid">
        <div class="page-header">
            <h4 class="page-title mb-0"><i class="ti-star menu-icon"></i> {{$t('page.suppliers_report')}}</h4>
            <nav aria-label="breadcrumb mb-0">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><router-link :to="{name: 'dashboard'}">{{$t('page.home')}}</router-link></li>
                    <li class="breadcrumb-item"><a href="javascript:;">{{$t('page.report')}}</a></li>
                    <li class="breadcrumb-item active" aria-current="page">{{$t('page.supplier')}}</li>
                </ol>
            </nav>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card card-body page-content-card">
                    <div class="d-md-flex">
                        <form action="" class="form-inline" @submit.prevent="searchFilter()">
                            <label class="control-label mb-2">{{$t('page.show')}}: </label>
                            <select class="form-control mx-sm-2 mb-2" v-model="filter.per_page" @change="searchFilter()">
                                <option value="15">15</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="200">200</option>
                                <option value="500">500</option>
                                <option value="1000000">All</option>
                            </select>
                            <input type="text" class="form-control form-control mb-2" v-model="filter.keyword" :placeholder="$t('page.keyword')" />
                            <button type="submit" class="btn btn-primary ms-md-2 mb-2"><i class="fe fe-search"></i> {{$t('page.search')}}</button>
                            <button type="button" class="btn btn-danger ms-2 mb-2" @click="resetFilter()"><i class="fe fe-x"></i> {{$t('page.reset')}}</button>
                        </form>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style="width:40px;">#</th>
                                    <th>{{$t('page.company')}}</th>
                                    <th>{{$t('page.name')}}</th>
                                    <th>{{$t('page.phone_number')}}</th>
                                    <th>{{$t('page.email')}}</th>
                                    <th>{{$t('page.total_purchases')}}</th>
                                    <th>{{$t('page.total_amount')}}</th>
                                    <th>{{$t('page.paid')}}</th>
                                    <th>{{$t('page.balance')}}</th>
                                    <th width="120">{{$t('page.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="data.length == 0"><td colspan="15" class="text-center">{{$t('page.no_data')}}</td></tr>
                                <tr :class="{'text-danger': item.status == 0}" v-for="(item, index) in data" :key="index">
                                    <td>{{ (filter.page - 1) * filter.per_page + index + 1 }}</td>
                                    <td>{{item.company}}</td>
                                    <td>{{item.name}}</td>
                                    <td>{{item.phone_number}}</td>
                                    <td>{{item.email}}</td>
                                    <td>
                                        {{item.total_purchases | currency}}
                                    </td>
                                    <td>
                                        {{item.total_amount | currency}} USD
                                        /
                                        {{item.total_amount_cop | currency}} COP
                                    </td>
                                    <td>
                                        {{item.paid_amount | currency}} USD
                                        /
                                        {{item.paid_amount_cop | currency}} COP
                                    </td>
                                    <td>
                                        {{item.total_amount - item.paid_amount | currency}} USD
                                        /
                                        {{item.total_amount_cop - item.paid_amount_cop | currency}} COP
                                    </td>
                                    <td class="py-2" align="center">
                                        <div class="btn-group">
                                            <button type="button" class="btn btn-sm btn-primary dropdown-toggle" data-bs-toggle="dropdown">{{$t('page.action')}}</button>
                                            <ul class="dropdown-menu">
                                                <li><a href="javascript:;" class="dropdown-item" @click="viewReports(item)">{{$t('page.view_reports')}}</a></li>
                                                <li><a href="javascript:;" class="dropdown-item" @click="downloadReport(item)">{{$t('page.report')}}</a></li>
                                                <!-- <li><a href="javascript:;" class="dropdown-item" @click="sendEmail(item)">{{$t('page.email')}}</a></li> -->
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colspan="5">{{$t('page.total')}}</th>
                                    <th>
                                        {{data.reduce((a, b) => a + parseInt(b.total_purchases), 0) | currency}}
                                    </th>
                                    <th>
                                        {{data.reduce((a, b) => a + parseInt(b.total_amount), 0) | currency}} USD
                                        /
                                        {{data.reduce((a, b) => a + parseInt(b.total_amount_cop), 0) | currency}} COP
                                    </th>
                                    <th>
                                        {{data.reduce((a, b) => a + parseInt(b.paid_amount), 0) | currency}} USD
                                        /
                                        {{data.reduce((a, b) => a + parseInt(b.paid_amount_cop), 0) | currency}} COP
                                    </th>
                                    <th>
                                        {{data.reduce((a, b) => a + parseInt(b.total_amount - b.paid_amount), 0) | currency}} USD
                                        /
                                        {{data.reduce((a, b) => a + parseInt(b.total_amount_cop - b.paid_amount_cop), 0) | currency}} COP
                                    </th>
                                    <th></th>
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
export default {
    middleware: 'auth',
    data() {
        return {
            data: [],
            filter: {
                page: 1,
                per_page: 15,
                keyword: '',
            },
            total: 0,
            page_count: 0,
        };
    },
    filters: {
        currency: function (value) {
            return value.toLocaleString();
        }
    },
    mounted() {
        this.searchData()
    },
    methods: {
        searchData() {
            let uri = '/report/suppliers_report';
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
        searchFilter() {
            this.filter.page = 1;
            this.searchData();
        },
        resetFilter() {
            this.filter = {
                page: 1,
                per_page: 15,
                keyword: '',
            }
        },
        sendEmail(item) {
            this.$isLoading(true)
            this.axios.get(`/supplier/email/${item.id}`).then(response => {
                this.$isLoading(false)
                if (response.data.status == 'Success') {
                    this.$toast.success(this.$t('message.successfully_done'));
                }
            });
        },
        downloadReport(item) {
            this.$isLoading(true)
            this.axios.get(`/supplier/report/${item.id}`).then(response => {
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
        viewReports(item) {
            this.$router.push({name: 'suppliers_report.view', params: {supplier_id: item.id}});
        }
    }
}
</script>