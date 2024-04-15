<template>
    <div class="main-container container-fluid">
        <div class="page-header">
            <h4 class="page-title mb-0"><i class="mdi mdi-sitemap-outline menu-icon"></i> {{$t('page.category')}}</h4>
            <nav aria-label="breadcrumb mb-0">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><router-link :to="{name: 'dashboard'}">{{$t('page.home')}}</router-link></li>
                    <li class="breadcrumb-item active" aria-current="page">{{$t('page.category')}}</li>
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
                            <!-- <select v-if="$isAdmin()" class="form-control me-2 mb-2" v-model="filter.company_id">
                                <option value="" hidden>{{ $t('page.company') }}</option>
                                <option v-for="(item, index) in companies" :key="index" :value="item.id">{{ item.name }}</option>
                            </select> -->
                            <company-selector v-if="$isAdmin()" v-model="filter.company_id" class="me-2 mb-2" />
                            <input type="text" class="form-control mb-2" v-model="filter.keyword" :placeholder="$t('page.keyword')" />
                            <button type="submit" class="btn btn-primary ms-md-2 mb-2"><i class="fe fe-search"></i> {{$t('page.search')}}</button>
                            <button type="button" class="btn btn-danger ms-2 mb-2" @click="resetFilter()"><i class="fe fe-x"></i> {{$t('page.reset')}}</button>
                        </form>
                        <button type="button" class="btn btn-success ms-auto mb-2" @click="addCategory()"><i class="ti-plus"></i>{{$t('page.add_new')}}</button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style="width:40px;">#</th>
                                    <th>{{$t('page.name')}}</th>
                                    <th>{{$t('page.ordered_quantity')}}</th>
                                    <th>{{$t('page.received_quantity')}}</th>
                                    <th>{{$t('page.percentage')}}</th>
                                    <th v-if="auth_user.role !== 'secretary'" width="75">{{$t('page.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="data.length == 0"><td colspan="15" class="text-center">{{$t('page.no_data')}}</td></tr>
                                <tr :class="{'text-danger': item.status == 0}" v-for="(item, index) in data" :key="index">
                                    <td>{{ (filter.page - 1) * filter.per_page + index + 1 }}</td>
                                    <td>{{item.name}}</td>
                                    <td>{{item.ordered_quantity}}</td>
                                    <td>{{item.received_quantity}}</td>
                                    <td v-if="item.ordered_quantity === 0">0 %</td>
                                    <td v-else>{{Math.round((item.received_quantity / item.ordered_quantity * 100))}} %</td>
                                    <td v-if="auth_user.role !== 'secretary'" class="action py-2">
                                        <div class="btn-container">
                                            <a href="javascript:;" class="btn-edit ms-2" @click.prevent="editUser(item)" :title="$t('page.edit')"><i class="ti-pencil-alt"></i></a>
                                            <a href="javascript:;" class="btn-delete ms-2" @click.prevent="deleteUser(item, index)" :title="$t('page.delete')"><i class="ti-trash"></i></a>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <div>
                                <p>{{$t('page.total')}} <strong style="color: red">{{ total }}</strong> {{$t('page.items')}}</p>
                            </div>
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
            <ui-modal name="category_modal"
                :title="form_mode == 'edit' ? $t('page.edit_category') : $t('page.add_category')"
            >
                <category-form :mode="form_mode"
                     :id="selected_category ? selected_category.id : ''"
                     @submit="categorySubmitted"
                />
            </ui-modal>
        </div>
    </div>
</template>
<script>
import CategoryForm from "~/components/category/CategoryForm.vue";
import Swal from 'sweetalert2'
import CompanySelector from '../components/ui/CompanySelector.vue';
export default {
    middleware: 'auth',
    components: {
        CategoryForm,
        CompanySelector,
    },
    data() {
        return {
            data: [],
            selected_category: null,
            filter: {
                page: 1,
                per_page: 15,
                company_id: '',
                keyword: '',
            },
            total: 0,
            page_count: 0,
            form_mode: 'add',
        };
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        },
        companies() {
            return this.$store.getters['data/companies'];
        }
    },
    mounted() {
        if (this.auth_user.company_id) {
            this.filter.company_id = this.auth_user.company_id;
        }
        this.searchData();
    },
    methods: {
        searchData() {
            let uri = '/category/search';
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
                per_page: 15,
                keyword: '',
                company_id: this.auth_user.company_id ? this.auth_user.company_id : '',
            }
            this.selected_category = null;
        },
        addCategory() {
            this.form_mode = 'add';
            this.selected_category = null,
            this.$modal.show('category_modal');
        },
        editUser(item) {
            this.form_mode = 'edit';
            this.selected_category = item,
            this.$modal.show('category_modal');
        },
        deleteUser(item, index) {
            Swal.fire({
                icon: 'warning',
                title: this.$t('message.are_you_sure'),
                reverseButtons: true,
                showCancelButton: true,
                confirmButtonText: this.$t('page.ok'),
                cancelButtonText: this.$t('page.cancel')
            }).then((result) => {
                if (result.isConfirmed) {
                    this.axios.delete(`/category/delete/${item.id}`).then(response => {
                        if (response.data.status == 'Success') {
                            this.$toast.success(this.$t('message.deleted_successfully'));
                            this.data.splice(index, 1);
                        }
                    })
                }
            })
        },
        categorySubmitted() {
            this.searchData();
            this.$modal.hide('category_modal');
        }
    }
}
</script>