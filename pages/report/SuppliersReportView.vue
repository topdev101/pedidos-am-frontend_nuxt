<template>
    <div class="main-container container-fluid">
        <div class="page-header">
            <h4 class="page-title mb-0"><i class="ti-credit-card menu-icon"></i> {{$t('page.suppliers_report')}}</h4>
            <nav aria-label="breadcrumb mb-0">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><router-link :to="{name: 'dashboard'}">{{$t('page.home')}}</router-link></li>
                    <li class="breadcrumb-item"><a href="javascript:;">{{$t('page.report')}}</a></li>
                    <li class="breadcrumb-item"><a href="javascript:;">{{$t('page.suppliers_report')}}</a></li>
                    <li class="breadcrumb-item active" aria-current="page">{{$t('page.overview')}}</li>
                </ol>
            </nav>
        </div>
        <div class="row">
            <div class="col-12 mt-2">
                <ul class="nav nav-pills nav-pills-success pb-1 border-bottom-0">
                    <li class="nav-item">
                        <a class="nav-link" href="javascript:;" :class="{active: tab == 'purchase'}" @click="tab = 'purchase'">{{$t('page.purchases')}}</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="javascript:;" :class="{active: tab == 'payment'}" @click="tab = 'payment'">{{$t('page.payments')}}</a>
                    </li>
                </ul>
            </div>
            <div class="col-12">
                <purchase-report :supplier_id="supplier_id" v-if="tab == 'purchase'"></purchase-report>
                <payment-report :supplier_id="supplier_id" v-if="tab == 'payment'"></payment-report>
            </div>
        </div>
    </div>
</template>
<script>
import PurchaseReport from "~/components/report/PurchaseReport.vue"
import PaymentReport from "~/components/report/PaymentReport.vue";
export default {
    middleware: 'auth',
    components: {
        PaymentReport, PurchaseReport,
    },
    data() {
        return {
            supplier_id: this.$route.params.supplier_id,
            tab: 'purchase',
        };
    },
}
</script>