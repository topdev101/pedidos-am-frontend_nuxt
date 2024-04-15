<template>
    <div class="product-detail">
        <div v-if="product" class="row mx-n2">
            <div class="col-md-5 px-2 mb-3">
                <div v-viewer class="main-image">
                    <img :src="product.main_image_url" width="100%" height="100%" alt="">
                </div>
                <div v-viewer class="other-images">
                    <div class="image-container me-2" v-for="(img, index) in product.images" :key="index">
                        <img :src="img.src" class="item-image" />
                    </div>
                </div>
            </div>
            <div class="col-md-7 px-2 mb-3 product-information">
                <ul class="list-group">
                    <li class="list-group-item">
                        <span class="field">{{ $t('page.brand') }} : </span>
                        <span class="value">{{ product.brand }}</span>
                    </li>
                    <li class="list-group-item">
                        <span class="field">{{ $t('page.reference') }} : </span>
                        <span class="value">{{ product.reference }}</span>
                    </li>
                    <li class="list-group-item">
                        <span class="field">{{ $t('page.vin') }} : </span>
                        <span class="value">{{ product.vin }}</span>
                    </li>
                    <li class="list-group-item">
                        <span class="field">{{ $t('page.engine_number') }} : </span>
                        <span class="value">{{ product.engine_number }}</span>
                    </li>
                    <li class="list-group-item">
                        <span class="field">{{ $t('page.supplier') }} : </span>
                        <span class="value">{{ product.supplier?.company }}</span>
                    </li>
                    <li class="list-group-item">
                        <span class="field">{{ $t('page.cost') }} : </span>
                        <span class="value">
                            <span class="value-usd">{{product.cost.value_usd | currency}} USD</span>
                            /
                            <span class="value-cop">{{product.cost.value_cop | currency}} COP</span>
                        </span>
                    </li>
                    <li class="list-group-item">
                        <span class="field">{{ $t('page.sale_price') }} : </span>
                        <span class="value">
                            <span class="value-usd">{{product.price.value_usd | currency}} USD</span>
                            /
                            <span class="value-cop">{{product.price.value_cop | currency}} COP</span>
                        </span>
                    </li>
                    <li class="list-group-item">
                        <span class="field">{{ $t('page.status') }} : </span>
                        <span class="value">
                            <span :class="{
                                    'badge': true,
                                    'badge-primary': product.product_status === 'in_the_city_of_purchase',
                                    'badge-secondary': product.product_status === 'in_destination_port',
                                    'badge-info': product.product_status === 'in_sale_window',
                                    'badge-warning': product.product_status === 'on_the_way',
                                    'badge-success': product.product_status === 'sold',
                                }"
                            >
                                {{ $t(`page.${product.product_status}`) }}
                            </span>
                        </span>
                    </li>
                    <li v-if="product.product_status === 'in_sale_window' && product.sale_window" class="list-group-item">
                        <span class="field">{{ $t('page.sales_showcase') }} : </span>
                        <span class="value">{{ product.sale_window.customer.name }}</span>
                    </li>
                    <li class="list-group-item">
                        <span class="field">{{ $t('page.interior_color') }} : </span>
                        <span class="value">{{ product.interior_color }}</span>
                    </li>
                    <li class="list-group-item">
                        <span class="field">{{ $t('page.exterior_color') }} : </span>
                        <span class="value">{{ product.exterior_color }}</span>
                    </li>
                </ul>
            </div>
            <div class="col-12 px-2">
                <h5>{{ $t('page.payment') }} ({{ $t('page.purchase') }})</h5>
                <div class="table-responsive">
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{{$t('page.date')}}</th>
                                <th>{{$t('page.reference_no')}}</th>
                                <th>{{$t('page.amount')}}</th>
                                <th>{{$t('page.note')}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="product.payments_purchase.length == 0"><td colspan="15" class="text-center">{{$t('page.no_payment')}}</td></tr>
                            <tr v-for="(item, index) in product.payments_purchase" :key="index">
                                <td>{{$moment(item.timestamp).format('YYYY-MM-DD')}}</td>
                                <td>{{item.reference_no}}</td>
                                <td>
                                    {{item.amount | currency}} USD
                                    /
                                    {{item.amount_cop | currency}} COP
                                </td>
                                <td class="py-1">
                                    <span>{{item.note}}</span>
                                    <span class="clearfix" v-viewer>
                                        <img v-for="(img, index) in item.images" :key="index" :src="img.src" class="item-image me-2" style="width: 30px; height: 30px;">
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <br />
                <h5>{{ $t('page.payment') }} ({{ $t('page.sale') }})</h5>
                <div class="table-responsive">
                    <table class="table table-bordered table-hover mb-0">
                        <thead>
                            <tr>
                                <th>{{$t('page.date')}}</th>
                                <th>{{$t('page.reference_no')}}</th>
                                <th>{{$t('page.amount')}}</th>
                                <th>{{$t('page.note')}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="product.payments_sale.length == 0"><td colspan="15" class="text-center">{{$t('page.no_payment')}}</td></tr>
                            <tr v-for="(item, index) in product.payments_sale" :key="index">
                                <td>{{$moment(item.timestamp).format('YYYY-MM-DD')}}</td>
                                <td>{{item.reference_no}}</td>
                                <td>
                                    {{item.amount | currency}} USD
                                    /
                                    {{item.amount_cop | currency}} COP
                                </td>
                                <td class="py-1">
                                    <span>{{item.note}}</span>
                                    <span class="clearfix" v-viewer>
                                        <img v-for="(img, index) in item.images" :key="index" :src="img.src" class="item-image me-2" style="width: 30px; height: 30px;">
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import 'viewerjs/dist/viewer.css'
import { directive as viewer } from "v-viewer"
export default {
    name: 'ProductDetail',
    props: {
        product_id: { type: [Number, String], required: true },
    },
    directives: {
        viewer: viewer({
            debug: true,
        }),
    },
    data() {
        return {
            product: null,
        }
    },
    filters: {
        currency: function (value) {
            return value.toLocaleString();
        }
    },
    mounted() {
        this.getDetail();
    },
    methods: {
        async getDetail() {
            const response = await this.axios.get(`/product/get_detail/${this.product_id}`);
            if (response.data.status === 'Success') {
                this.product = response.data.data;
            }
        },
    }
}
</script>
<style scoped lang="scss">
    .main-image {
        height: 250px;
        margin-bottom: 12px;
        img {
            object-fit: cover;
            border-radius: 6px;
        }
    }
    .other-images {
        display: flex;
        overflow: auto;
        .image-container {
            width: 60px;
            height: 60px;
            min-width: 60px;
            margin-bottom: 4px;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 4px;
            }
        }
    }
    .product-information {
        .list-group-item {
            padding-top: 6px;
            padding-bottom: 6px;
            .field {
                display: inline-block;
                width: 40%;
            }
        }
    }
</style>