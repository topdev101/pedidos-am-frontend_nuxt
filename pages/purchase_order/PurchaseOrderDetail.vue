<template>
    <div class="main-container container-fluid">
        <div class="page-header">
            <h4 class="page-title mb-0"><i class="mdi mdi-truck-outline menu-icon"></i> {{$t('page.purchase_order_detail')}}</h4>
            <nav aria-label="breadcrumb mb-0">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><router-link :to="{name: 'dashboard'}">{{$t('page.home')}}</router-link></li>
                    <li class="breadcrumb-item"><router-link :to="{name: 'purchase_order.index'}">{{$t('page.purchase_orders')}}</router-link></li>
                    <li class="breadcrumb-item active" aria-current="page">{{$t('page.detail')}}</li>
                </ol>
            </nav>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card card-body" v-if="model">
                    <div class="row">
                        <div class="col-md-4 mb-2">
                            <div class="card bg-info img-card box-info-shadow card-detail">
                                <div class="card-body">
                                    <h3 class="mb-3">{{$t('page.supplier')}}</h3>
                                    <p><strong class="me-2">{{$t('page.name')}}:</strong>{{model.supplier.display_name}}</p>
                                    <p><strong class="me-2">{{$t('page.brand')}}:</strong>{{model.supplier.brand}}</p>
                                    <p class="mb-0"><strong class="me-2">{{$t('page.phone_number')}}:</strong>{{model.supplier.phobne_number}}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 mb-2">
                            <div class="card bg-success img-card box-success-shadow card-detail">
                                <div class="card-body">
                                    <h3 class="mb-3">{{$t('page.reference')}}</h3>
                                    <p><strong class="me-2">{{$t('page.reference_no')}}:</strong>{{model.reference_no}}</p>
                                    <p class="me-2"><strong class="me-2">{{$t('page.date')}}:</strong>{{$moment(model.timestamp).format('YYYY-MM-DD')}}</p>
                                    <p>
                                        <strong class="mb-0">{{$t('page.attachment')}}:</strong>
                                        <span class="clearfix" v-viewer v-if="model.images">
                                            <img v-for="img in model.images" :key="img.id" :src="img.src" style="width: 30px; height: 30px;" class="item-image me-1" />
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 mb-2">
                            <div class="card bg-primary img-card box-primary-shadow card-detail">
                                <div class="card-body">
                                    <h3 class="mb-3">{{$t('page.created_at')}}</h3>
                                    <p><strong class="me-2">{{$t('page.created_by')}}:</strong>{{model.user.username}}</p>
                                    <p class="mb-0"><strong class="me-2">{{$t('page.created_at')}}:</strong>{{$moment(model.created_at).format('YYYY-MM-DD')}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3" v-if="model.supplier.note">
                        <div class="col-md-12">
                            <h5>{{$t('page.supplier_note')}}</h5>
                            <p class="mx-2">{{model.supplier.note}}</p>
                        </div>
                    </div>
                    <div class="row my-3">
                        <div class="col-12 table-responsive">
                            <h5>{{$t('page.order_items')}}</h5>
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th width="50">#</th>
                                        <th>{{$t('page.product')}}</th>
                                        <th>{{$t('page.product_cost')}}</th>
                                        <th>{{$t('page.discount')}}</th>
                                        <th>{{$t('page.quantity')}}</th>
                                        <th>{{$t('page.image')}}</th>
                                        <th>{{$t('page.category')}}</th>
                                        <th>{{$t('page.subtotal')}}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in model.items" :key="index">
                                        <td>{{index + 1}}</td>
                                        <td>{{item.product}}</td>
                                        <td>{{item.cost | currency}}</td>
                                        <td>{{item.discount_string}}</td>
                                        <td>{{item.quantity}}</td>
                                        <td class="p-1">
                                            <span class="clearfix" v-viewer v-if="item.images">
                                                <img v-for="img in item.images" :key="img.id" :src="img.src" style="width: 30px; height: 30px;" class="item-image me-1" />
                                            </span>
                                        </td>
                                        <td>{{item.category?.name}}</td>
                                        <td>{{item.cost * item.quantity - item.discount | currency}}</td>
                                    </tr>
                                </tbody>
                                <tfoot class="tx-bold tx-black">
                                    <tr>
                                        <th colspan="4" class="tx-bold" style="text-align:right">{{$t('page.total')}} (COP)</th>
                                        <th>{{model.items.reduce((a, b) => a + parseInt(b.quantity), 0) | currency}}</th>
                                        <th colspan="2"></th>
                                        <th>{{model.items.reduce((a, b) => a + (parseInt(b.cost * b.quantity) - b.discount), 0) | currency}}</th>
                                    </tr>
                                    <tr>
                                        <th colspan="7" style="text-align:right">{{$t('page.total_amount')}} (COP)</th>
                                        <th>{{model.total_amount | currency}}</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                    <div class="row mb-3" v-if="model.note">
                        <div class="col-md-12">
                            <h5>{{$t('page.note')}}</h5>
                            <p>{{model.note}}</p>
                        </div>
                    </div>
                    <div class="d-flex">
                        <div class="ms-auto">
                            <router-link :to="{ name: 'purchase_order.index' }" class="btn btn-primary mb-2 mb-md-0"><i class="ti-shopping-cart"></i>{{$t('page.purchase_orders')}}</router-link>
                            <a href="javascript:;" class="btn btn-danger" @click="$router.back()"><i class="fe fe-x"></i>{{$t('page.back')}}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import 'viewerjs/dist/viewer.css'
import { directive as viewer } from "v-viewer"
export default {
    middleware: 'auth',
    directives: {
        viewer: viewer({
            debug: true,
        }),
    },
    data() {
        return {
            serverUrl: process.env.serverUrl,
            id: null,
            model: null,
        }
    },
    filters: {
        currency: function (value) {
            value = Number(value);
            return value.toLocaleString();
        }
    },
    created() {
        this.id = this.$route.params.id;
        this.loadPurchase()
    },
    methods: {
        loadPurchase() {
            this.$isLoading(true)
            this.axios.get(`/purchase_order/get_detail/${this.id}`).then(response => {
                this.$isLoading(false)
                if (response.data.status == 'Success') {
                    this.model = response.data.data;
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
    .card-detail {
        height: 100%;
        p {
            font-size: 16px;
        }
    }
</style>