<template>
    <div class="main-container container-fluid">
        <div class="page-header">
            <h4 class="page-title mb-0"><i class="mdi mdi-car-outline menu-icon"></i> {{$t('page.add_purchase')}}</h4>
            <nav aria-label="breadcrumb mb-0">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><router-link :to="{name: 'dashboard'}">{{$t('page.home')}}</router-link></li>
                    <li class="breadcrumb-item"><router-link :to="{name: 'purchase.index'}">{{$t('page.purchase')}}</router-link></li>
                    <li class="breadcrumb-item active" aria-current="page">{{$t('page.add')}}</li>
                </ol>
            </nav>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card card-body page-content-card">
                    <purchase-form mode="add"></purchase-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import PurchaseForm from "~/components/purchase/PurchaseForm.vue";
export default {
    middleware: 'auth',
    components: {
        PurchaseForm,
    }
}
</script>