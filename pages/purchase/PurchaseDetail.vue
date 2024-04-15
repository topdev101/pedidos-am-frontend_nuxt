<template>
    <div class="main-container container-fluid">
        <div class="page-header">
            <h4 class="page-title mb-0"><i class="mdi mdi-car-outline menu-icon"></i> {{$t('page.purchase_detail')}}</h4>
            <nav aria-label="breadcrumb mb-0">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><router-link :to="{name: 'dashboard'}">{{$t('page.home')}}</router-link></li>
                    <li class="breadcrumb-item"><router-link :to="{name: 'purchase.index'}">{{$t('page.purchase')}}</router-link></li>
                    <li class="breadcrumb-item active" aria-current="page">{{$t('page.detail')}}</li>
                </ol>
            </nav>
        </div>
        <div class="row">
            <div class="col-12">
                <div v-if="model" class="row">
                    <div class="col-md-4 mb-4">
                        <div class="card bg-primary img-card box-primary-shadow card-detail">
                            <div class="card-body">
                                <h3 class="mb-3">{{$t('page.supplier')}}</h3>
                                <p><strong class="me-2">{{$t('page.name')}}:</strong>{{model.supplier.display_name}}</p>
                                <p><strong class="me-2">{{$t('page.brand')}}:</strong>{{model.supplier.brand}}</p>
                                <p class="mb-0"><strong class="me-2">{{$t('page.phone_number')}}:</strong>{{model.supplier.phone_number}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-4">
                        <div class="card bg-info img-card box-info-shadow card-detail">
                            <div class="card-body">
                                <h3 class="mb-3">{{$t('page.store')}}</h3>
                                <p><strong class="me-2">{{$t('page.store')}}:</strong>{{model.store?.name}}</p>
                                <p><strong class="me-2 mb-0">{{$t('page.company')}}:</strong>{{model.store.company?.name}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-4">
                        <div class="card bg-success img-card box-success-shadow card-detail">
                            <div class="card-body">
                                <h3 class="mb-3">{{$t('page.reference')}}</h3>
                                <p><strong class="me-2">{{$t('page.reference_no')}}:</strong>{{model.reference_no}}</p>
                                <p><strong class="me-2">{{$t('page.date')}}:</strong>{{$moment(model.purchased_at).format('YYYY-MM-DD')}}</p>
                                <p><strong class="me-2">{{$t('page.shipping_carrier')}}:</strong>{{model.shipping_carrier}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card card-body page-content-card" v-if="model">
                    <div>
                        <h5>{{$t('page.attachment')}}</h5>
                        <div class="clearfix images d-flex align-items-center" v-viewer>
                            <span v-for="(img, index) in model.images" :key="index" class="me-2">
                                <img v-if="img.mime === 'image'" :src="img.src" class="item-image" />
                                <video v-else-if="img.mime === 'video'" :src="img.src" class="item-image"></video>
                                <a v-else :href="img.src" download="download" target="_blank" class="item-attachment"><i class="ti-file"></i></a>
                            </span>
                            <p class="text-muted" v-if="model.images.length == 0">{{$t('page.no_image')}}</p>
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
                                    <th>{{$t('page.category')}}</th>
                                    <th>{{$t('page.product_cost')}}</th>
                                    <th>{{$t('page.quantity')}}</th>
                                    <th>{{$t('page.subtotal')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in model.items" :key="index">
                                    <td>{{index + 1}}</td>
                                    <td>
                                        {{item.product}}
                                    </td>
                                    <td>{{item.category.name}}</td>
                                    <td>{{item.cost | currency}}</td>
                                    <td>{{item.quantity}}</td>
                                    <td>{{item.cost * item.quantity | currency}}</td>
                                </tr>
                            </tbody>
                            <tfoot class="tx-bold tx-black">
                                <tr>
                                    <th colspan="4" class="tx-bold" style="text-align:right">{{$t('page.total')}}</th>
                                    <th>{{model.items.reduce((a, b) => a + parseInt(b.quantity), 0) | currency}}</th>
                                    <th>{{model.items.reduce((a, b) => a + parseInt(b.cost * b.quantity), 0) | currency}}</th>
                                </tr>
                                <tr>
                                    <th colspan="5" style="text-align:right">{{$t('page.total_amount')}} (COP)</th>
                                    <th>{{model.total_amount | currency}}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    </div>
                    <div class="row mb-3" v-if="model.note">
                        <div class="col-md-12">
                            <h5>{{$t('page.note')}}</h5>
                            <p class="mx-2">{{model.note}}</p>
                        </div>
                    </div>
                    <div class="text-end">
                        <router-link :to="{ name: 'purchase.index' }" class="btn btn-primary me-2"><i class="ti-shopping-cart"></i> {{$t('page.received_orders')}}</router-link>
                        <router-link :to="{name: 'purchase_order.receive', params: {id: model.purchase_order_id}}" class="btn btn-success"><i class="ti-money"></i> {{$t('page.receive')}}</router-link>
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
            this.axios.get(`/purchase/get_detail/${this.id}`).then(response => {
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
        margin-bottom: 0;
        p {
            font-size: 16px;
        }
    }
</style>