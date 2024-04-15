<template>
    <div class="main-container container-fluid">
        <div class="page-header">
            <h4 class="page-title mb-0"><i class="ti-credit-card menu-icon"></i> {{$t('page.income_report')}}</h4>
            <nav aria-label="breadcrumb mb-0">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><router-link :to="{name: 'dashboard'}">{{$t('page.home')}}</router-link></li>
                    <li class="breadcrumb-item"><a href="javascript:;">{{$t('page.report')}}</a></li>
                    <li class="breadcrumb-item active" aria-current="page">{{$t('page.income_report')}}</li>
                </ol>
            </nav>
        </div>
        <div class="row">
            <div class="col-12">
                <payment-report type="sale" />
            </div>
        </div>
    </div>
</template>
<script>
import PaymentReport from "~/components/report/PaymentReport.vue";
export default {
    middleware: 'auth',
    components: {
        PaymentReport,
    },
}
</script>