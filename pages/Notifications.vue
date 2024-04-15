<template>
    <div class="main-container container-fluid">
        <div class="page-header">
            <h4 class="page-title mb-0"><i class="mdi mdi-bell-outline menu-icon"></i> {{$t('page.notifications')}}</h4>
            <nav aria-label="breadcrumb mb-0">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><router-link :to="{name: 'dashboard'}">{{$t('page.home')}}</router-link></li>
                    <li class="breadcrumb-item active" aria-current="page">{{$t('page.notifications')}}</li>
                </ol>
            </nav>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card card-body page-content-card">
                    <div class="d-md-flex mb-3">
                        <button v-if="$isAdmin()" type="button" class="btn btn-success ms-auto mb-2" @click="deleteAll()"><i class="ti-trash"></i>{{$t('page.delete_all')}}</button>
                    </div>
                    <div class="table-responsive">
                        <div class="notification-menu mb-4 mb-md-5">
                            <a v-for="(item, index) in data" :key="index" href="javascript:;" class="dropdown-item d-flex align-items-center">
                                <div class="me-3 avatar avatar-md rounded-5 bg-success">
                                    <i class="fe fe-shopping-cart"></i>
                                </div>
                                <div class="mt-1 wd-80p">
                                    <p class="fs-15 mb-0 message">{{ message(item) }}</p>
                                    <span class="fs-13">{{ $moment(item.created_at).fromNow() }}</span>
                                </div>
                                <a v-if="$isAdmin()" href="javascript:;" class="ms-auto" @click.prevent="deleteOne(item)">
                                    <i class="fe fe-trash fs-18"></i>
                                </a>
                            </a>
                            <div v-if="data.length === 0" class="notification-item text-center">{{ $t('page.no_data') }}</div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-2 px-md-3">
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
        </div>
    </div>
</template>
<script>
import Swal from 'sweetalert2'
export default {
    name: 'Notifications',
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
    mounted() {
        this.searchData();
    },
    methods: {
        searchData() {
            let uri = '/notification/search';
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
            }
        },
        deleteOne(item, index) {
            Swal.fire({
                icon: 'warning',
                title: this.$t('message.are_you_sure'),
                reverseButtons: true,
                showCancelButton: true,
                confirmButtonText: this.$t('page.ok'),
                cancelButtonText: this.$t('page.cancel')
            }).then((result) => {
                if (result.isConfirmed) {
                    this.axios.delete(`/notification/delete/${item.id}`).then(response => {
                        if (response.data.status == 'Success') {
                            this.$toast.success(this.$t('message.deleted_successfully'));
                            this.data.splice(index, 1);
                        }
                    })
                }
            });
        },
        deleteAll() {
            Swal.fire({
                icon: 'warning',
                title: this.$t('message.are_you_sure'),
                reverseButtons: true,
                showCancelButton: true,
                confirmButtonText: this.$t('page.ok'),
                cancelButtonText: this.$t('page.cancel')
            }).then((result) => {
                if (result.isConfirmed) {
                    this.axios.delete(`/notification/delete_all`).then(response => {
                        if (response.data.status == 'Success') {
                            this.$toast.success(this.$t('message.deleted_successfully'));
                            this.searchFilter();
                        }
                    })
                }
            });
        },
        message(item) {
            const message = item.message;
            switch (message) {
                case 'greater_discounted_order':
                    return this.$t('message.greater_discounted_order', {supplier: item.supplier.name, company: item.notifiable?.name});
                    break;
                default:
                    break;
            }
            return message
        }
    }
}
</script>