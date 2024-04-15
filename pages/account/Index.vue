<template>
    <div class="main-container container-fluid">
        <div class="page-header">
            <h4 class="page-title mb-0"><i class="ti-user menu-icon"></i> {{$t('page.my_profile')}}</h4>
            <nav aria-label="breadcrumb mb-0">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><router-link :to="{name: 'dashboard'}">{{$t('page.home')}}</router-link></li>
                    <li class="breadcrumb-item"><a href="javascript:;">{{$t('page.account')}}</a></li>
                    <li class="breadcrumb-item active" aria-current="page">{{$t('page.profile')}}</li>
                </ol>
            </nav>
        </div>
        <div class="row">
            <div class="col-md-3">
                <div class="card card-body page-content-card">
                    <ul class="nav nav-pills nav-fill flex-column">
                        <li v-for="tab in tabs" :key="tab.route" class="nav-item">
                            <router-link :to="{ name: tab.route }" class="nav-link mt-2 border p-2" active-class="active">
                                <i :class="`ti-${tab.icon}`"></i>&nbsp;
                                {{ tab.name }}
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="col-md-9">
                <transition name="fade" mode="out-in">
                    <router-view />
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    middleware: 'auth',

    computed: {
        tabs () {
            return [
                {
                    icon: 'user',
                    name: this.$t('page.profile'),
                    route: 'account.profile'
                },
                {
                    icon: 'lock',
                    name: this.$t('page.password'),
                    route: 'account.password'
                },
                {
                    icon: 'google',
                    name: this.$t('page.google_authenticator'),
                    route: 'account.google_2fa'
                }
            ]
        }
    }
}
</script>

<style>
.settings-card .card-body {
  padding: 0;
}
</style>
