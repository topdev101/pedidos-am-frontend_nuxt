<template>
    <div class="main-container container-fluid">
        <div class="page-header">
            <h4 class="page-title mb-0"><i class="mdi mdi-truck-outline menu-icon"></i> {{$t('page.add_purchase_order')}}</h4>
            <nav aria-label="breadcrumb mb-0">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><router-link :to="{name: 'dashboard'}">{{$t('page.home')}}</router-link></li>
                    <li class="breadcrumb-item"><router-link :to="{name: 'purchase_order.index'}">{{$t('page.purchase_orders')}}</router-link></li>
                    <li class="breadcrumb-item active" aria-current="page">{{$t('page.edit')}}</li>
                </ol>
            </nav>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card card-body page-content-card">
                    <purchase-order-form mode="edit" :id="id" ></purchase-order-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import PurchaseOrderForm from "~/components/purchase_order/PurchaseOrderForm.vue";
export default {
    middleware: 'auth',
    components: {
        PurchaseOrderForm,
    },
    data() {
        return {
            id: ''
        }
    },
    created() {
        this.id = this.$route.params.id;
    }
}
</script>