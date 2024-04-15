<template>
    <aside class="app-sidebar ps horizontal-main ps--active-y" ref="sidebar">
        <div class="app-sidebar__header">
            <router-link :to="{ name: 'dashboard' }" class="main-logo" href="/">
                <span class="desktop-logo desktop-logo-dark">{{ appName }}</span>
                <span class="desktop-logo">{{ appName }}</span>
                <span class="mobile-logo mobile-logo-dark">{{ appName.charAt(0) }}</span>
                <span class="mobile-logo">{{ appName.charAt(0) }}</span>
            </router-link>
        </div>
        <div class="main-sidemenu">
            <div class="slide-left disabled" id="slide-left">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>
                </svg>
            </div>
            <ul class="side-menu" v-if="auth_user">
                <li class="slide">
                    <router-link :to="{ name: 'dashboard' }" class="side-menu__item" :class="{active: router == 'dashboard'}">
                        <span class="side-menu__icon">
                            <i class="mdi mdi-home-circle side_menu_img"></i>
                        </span>
                        <span class="side-menu__label">{{$t('page.dashboard')}}</span>
                    </router-link>
                </li>
                <li class="slide" :class="{active: router == 'purchase_order.index'}">
                    <router-link :to="{ name: 'purchase_order.index' }" class="side-menu__item">
                        <span class="side-menu__icon"><i class="mdi mdi-truck-outline side_menu_img"></i></span>
                        <span class="side-menu__label">{{$t('page.purchase_orders')}}</span>
                    </router-link>
                </li>
                <li class="slide" :class="{active: router == 'purchase.index'}">
                    <router-link :to="{ name: 'purchase.index' }" class="side-menu__item">
                        <span class="side-menu__icon"><i class="mdi mdi-truck-check-outline side_menu_img"></i></span>
                        <span class="side-menu__label">{{$t('page.received_orders')}}</span>
                    </router-link>
                </li>
                <li class="slide" :class="{active: router == 'category.index'}">
                    <router-link :to="{ name: 'category.index' }" class="side-menu__item">
                        <span class="side-menu__icon"><i class="mdi mdi-sitemap-outline side_menu_img"></i></span>
                        <span class="side-menu__label">{{$t('page.categories')}}</span>
                    </router-link>
                </li>
                <li v-if="$isAdmin()" class="slide" :class="{active: router == 'company.index'}">
                    <router-link :to="{ name: 'company.index' }" class="side-menu__item">
                        <span class="side-menu__icon"><i class="mdi mdi-domain side_menu_img"></i></span>
                        <span class="side-menu__label">{{$t('page.company')}}</span>
                    </router-link>
                </li>
                <li v-if="$isAdmin()" class="slide" :class="{active: router == 'store.index'}">
                    <router-link :to="{ name: 'store.index' }" class="side-menu__item">
                        <span class="side-menu__icon"><i class="mdi mdi-store-outline side_menu_img"></i></span>
                        <span class="side-menu__label">{{$t('page.stores')}}</span>
                    </router-link>
                </li>
                <!-- <li class="slide" :class="{'is-expanded': sidenav_toggled &&  expanded_menu == 'report'}" @mouseenter="expandSubmenu('report')" @mouseleave="hideSubmenu">
                    <a class="side-menu__item" href="javascript:;" :class="{active: route_names.report.includes(router)}">
                        <span class="side-menu__icon"><i class="mdi mdi-note-text-outline side_menu_img"></i></span>
                        <span class="side-menu__label">{{$t('page.report')}}</span>
                    </a>
                    <ul class="slide-menu" :class="{'open d-block': (sidenav_toggled || is_mobile) && expanded_menu === 'report'}">
                        <li class="panel sidetab-menu">
                            <div class="panel-body tabs-menu-body p-0 border-0">
                                <div class="tab-content">
                                    <div class="tab-pane active">
                                        <ul class="sidemenu-list">
                                            <li v-for="(route_item, index) in route_names.report" :key="index">
                                                <router-link :to="{ name: route_item }" class="slide-item" active-class="active">
                                                    {{$t(`page.${route_item}`)}}
                                                </router-link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li> -->
                <li class="slide" :class="{'is-expanded': sidenav_toggled && expanded_menu === 'people'}" @mouseenter="expandSubmenu('people')" @mouseleave="hideSubmenu">
                    <a class="side-menu__item" href="javascript:;" :class="{active: ['supplier.index', 'user.index'].includes(router)}">
                        <span class="side-menu__icon"><i class="mdi mdi-account-circle side_menu_img"></i></span>
                        <span class="side-menu__label">{{$t('page.people')}}</span>
                    </a>
                    <ul class="slide-menu" :class="{'open d-block': (sidenav_toggled || is_mobile) && expanded_menu === 'people'}">
                        <li class="panel sidetab-menu">
                            <div class="panel-body tabs-menu-body p-0 border-0">
                                <div class="tab-content">
                                    <div class="tab-pane active">
                                        <ul class="sidemenu-list">
                                            <li>
                                                <router-link :to="{ name: 'supplier.index' }" class="slide-item" active-class="active">{{$t('page.supplier')}}</router-link>
                                            </li>
                                            <li v-if="$isAdmin()">
                                                <router-link :to="{ name: 'user.index' }" class="slide-item" active-class="active">{{$t('page.user')}}</router-link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
                <li v-if="!$isAdmin()" class="slide" :class="{active: router == 'spy'}">
                    <router-link :to="{ name: 'spy' }" class="side-menu__item">
                        <span class="side-menu__icon"><i class="mdi mdi-eye-outline side_menu_img"></i></span>
                        <span class="side-menu__label">{{$t('page.spy')}}</span>
                    </router-link>
                </li>
            </ul>
        </div>
    </aside>
</template>

<script>
export default {
    name: 'Sidebar',
    data() {
        return {
            appName: process.env.appName,
            expanded_menu: '',
            router: this.$route.name,
            route_names: {
                purchase: ['purchase.index', 'purchase.add', 'purchase.edit', 'purchase.detail'],
                people: ['supplier.index', 'user.index'],
                report: [
                    'purchase_orders_report',
                    'received_orders_report',
                    'suppliers_report',
                ],
            },
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        },
        sidenav_toggled() {
            return this.$store.getters['data/sidenav_toggled'];
        },
        is_mobile() {
            return this.$store.getters['data/is_mobile'];
        }
    },
    watch: {
        '$route': function (newRoute) {
            this.router = newRoute.name
        },
        expanded_menu(value) {
            this.$store.dispatch('data/showSidenav', !!value);
        }
    },
    mounted() {
        document.body.classList.add('sidebar-dark')
    },
    methods: {
        expandSubmenu(menu) {
            if (this.sidenav_toggled || this.is_mobile) {
                this.expanded_menu = menu;
            } else {
                this.$refs.sidebar.scrollTop = 0;
                this.$store.dispatch('data/showSidenav', true);
            }
        },
        hideSubmenu() {
            if (this.sidenav_toggled) {
                this.expanded_menu = '';
            } else {
                this.$store.dispatch('data/showSidenav', false);
            }
        }
    },
}
</script>
<style lang="scss" scoped>
    .app-sidebar {
        position: fixed !important;
        &::-webkit-scrollbar {
            width: 0;
        }
    }
    .side-menu__item {
        &.active, &.router-link-active {
            .side-menu__label, .side-menu__icon {
                color: #556ee7 !important;
            }
        }
    }
    .app {
        &:not(.sidenav-toggled) {
            .slide .slide-menu {
                background: transparent !important;
            }
        }
    }

    @media (min-width: 992px) {
        .sidebar-mini {
            &.sidenav-toggled {
                &.show-sidenav {
                    .slide .slide-menu {
                        inset-inline-start: 125px;
                    }
                }
                .app-sidebar {
                    position: fixed !important;
                    width: 160px !important;
                    &__header {
                        width: 160px !important;
                    }
                }
            }
            .app-sidebar .main-sidemenu {
                margin-block-start: 66px;
            }
        }
    }
    @media (max-width: 992px) {
        .sidebar-mini {
            &.sidenav-toggled .app-sidebar {
                overflow: auto;
            }
        }
    }
</style>