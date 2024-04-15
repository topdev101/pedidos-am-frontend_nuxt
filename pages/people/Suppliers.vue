<template>
    <div class="main-container container-fluid">
        <div class="page-header">
            <h4 class="page-title mb-0"><i class="ti-user menu-icon"></i> {{$t('page.supplier_management')}}</h4>
            <nav aria-label="breadcrumb mb-0">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><router-link :to="{name: 'dashboard'}">{{$t('page.home')}}</router-link></li>
                    <li class="breadcrumb-item"><a href="javascript:;">{{$t('page.supplier')}}</a></li>
                    <li class="breadcrumb-item active" aria-current="page">{{$t('page.list')}}</li>
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
                            <input type="text" class="form-control form-control mb-2" v-model="filter.keyword" :placeholder="$t('page.keyword')" />
                            <button type="submit" class="btn btn-primary ms-md-2 mb-2"><i class="fe fe-search"></i> {{$t('page.search')}}</button>
                            <button type="button" class="btn btn-danger ms-2 mb-2" @click="resetFilter()"><i class="fe fe-x"></i> {{$t('page.reset')}}</button>
                        </form>
                        <button type="button" class="btn btn-success ms-auto mb-2" @click="addSupplier()"><i class="ti-plus"></i>{{$t('page.add_new')}}</button>
                    </div>
                    <div class="table-responsive" style="min-height: 300px;">
                        <table class="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style="width:40px;">#</th>
                                    <th>{{$t('page.name')}}</th>
                                    <th>{{$t('page.brand')}}</th>
                                    <th>{{$t('page.phone_number')}}</th>
                                    <th>{{$t('page.address')}}</th>
                                    <th>{{$t('page.discount')}}</th>
                                    <th>{{$t('page.ordered_quantity')}}</th>
                                    <th>{{$t('page.received_quantity')}}</th>
                                    <th v-if="!$isSecretary()" width="94">{{$t('page.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="data.length == 0"><td colspan="15" class="text-center">{{$t('page.no_data')}}</td></tr>
                                <tr :class="{'text-danger': item.status == 0}" v-for="(item, index) in data" :key="index">
                                    <td>{{ (filter.page - 1) * filter.per_page + index + 1 }}</td>
                                    <td>{{item.display_name}}</td>
                                    <td>{{item.brand}}</td>
                                    <td>{{item.phone_number}}</td>
                                    <td>{{item.address}}</td>
                                    <td>{{item.discount}}</td>
                                    <td>{{ item.ordered_quantity | currency }}</td>
                                    <td>{{ item.received_quantity | currency }}</td>
                                    <td v-if="!$isSecretary()" class="py-2" align="center">
                                        <div class="dropdown">
                                            <button type="button"
                                                 class="btn btn-sm btn-primary dropdown-toggle"
                                                 data-bs-toggle="dropdown"
                                                 :disabled="!$hasEditPermission(item.company_id) && !$hasDeletePermission(item.company_id)"
                                            >{{$t('page.action')}}</button>
                                            <ul class="dropdown-menu">
                                                <!-- <li><a href="javascript:;" class="dropdown-item" @click="downloadReport(item)">{{$t('page.report')}}</a></li> -->
                                                <li v-if="$hasEditPermission(item.company_id)"><a href="javascript:;" class="dropdown-item" @click="editSupplier(item)">{{$t('page.edit')}}</a></li>
                                                <li v-if="$hasDeletePermission(item.company_id)"><a href="javascript:;" class="dropdown-item" @click="deleteSupplier(item, index)">{{$t('page.delete')}}</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
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
            <ui-modal ref="supplierModal" name="supplier_modal"
                :title="form_mode == 'edit' ? $t('page.edit_supplier') : $t('page.add_supplier')"
            >
                <supplier-form :mode="form_mode"
                    :id="selected_supplier ? selected_supplier.id : ''"
                    @submit="supplierSubmitted"
                />
            </ui-modal>
        </div>
    </div>
</template>
<script>
import SupplierForm from "~/components/supplier/SupplierForm.vue";
import Swal from 'sweetalert2'
import CompanySelector from '~/components/ui/CompanySelector.vue';
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
export default {
    name: 'SupplierList',
    middleware: 'auth',
    components: {
        SupplierForm,
        CompanySelector,
        DateRangePicker,
    },
    data() {
        return {
            data: [],
            selected_supplier: null,
            dateRange: {
                startDate: '',
                endDate: '',
            },
            filter: {
                page: 1,
                per_page: 15,
                keyword: '',
                company_id: '',
            },
            total: 0,
            page_count: 0,
            form_mode: 'add',
        };
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        }
    },
    filters: {
        currency: function (value) {
            return value.toLocaleString();
        }
    },
    mounted() {
        this.filter.company_id = this.auth_user.role === 'admin' ? '' : this.auth_user.company_id;
        this.searchData()
    },
    methods: {
        searchData() {
            let uri = '/supplier/search';
            const params = {
                ...this.filter,
                ...this.dateRange,
            };
            this.$isLoading(true);
            this.axios.get(uri, {params: params}).then(response => {
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
                company_id: this.auth_user.role === 'admin' ? '' : this.auth_user.company_id,
            }
            this.dateRange = {
                startDate: '',
                endDate: '',
            }
            this.selected_supplier = null;
        },
        addSupplier() {
            this.form_mode = 'add';
            this.selected_supplier = null,
            this.$modal.show('supplier_modal');
        },
        editSupplier(item) {
            this.form_mode = 'edit';
            this.selected_supplier = item,
            this.$modal.show('supplier_modal');
        },
        supplierSubmitted(data) {
            this.searchFilter();
            this.$refs.supplierModal.close();
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
        deleteSupplier(item, index) {
            Swal.fire({
                icon: 'warning',
                title: this.$t('message.are_you_sure'),
                reverseButtons: true,
                showCancelButton: true,
                confirmButtonText: this.$t('page.ok'),
                cancelButtonText: this.$t('page.cancel')
            }).then((result) => {
                if (result.isConfirmed) {
                    this.axios.delete(`/supplier/delete/${item.id}`).then(response => {
                        if (response.data.status == 'Success') {
                            this.$toast.success(this.$t('message.deleted_successfully'));
                            this.data.splice(index, 1);
                        }
                    });
                }
            })
        }
    }
}
</script>