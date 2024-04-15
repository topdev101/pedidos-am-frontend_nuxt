<template>
    <div class="main-header side-header sticky" style="margin-bottom: 65px;">
		<div class="container-fluid main-container">
            <div class="main-header-left sidemenu">
                <a class="main-header-menu-icon"
                     href="javascript:;"
                     @click.prevent="toggleSidebarActive"
                ><span></span></a>
            </div>
            <div class="main-header-left horizontal d-md-none">
                <router-link :to="{ name: 'dashboard' }">
                    <span class="desktop-logo desktop-logo-dark">{{ appName }}</span>
                    <span class="desktop-logo theme-logo">{{ appName }}</span>
                </router-link>
            </div>
            <div v-if="user" class="main-header-right">
                <button class="navbar-toggler navresponsive-toggler d-lg-none ms-auto collapsed" type="button"
                    data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent-4"
                    aria-controls="navbarSupportedContent-4">
                    <span class="navbar-toggler-icon fe fe-more-vertical"></span>
                </button>
                <div class="navbar navbar-expand-lg navbar-collapse responsive-navbar p-0">
                    <div class="collapse navbar-collapse" id="navbarSupportedContent-4">
                        <ul class="nav nav-item header-icons navbar-nav-right ms-auto justify-content-end">
                            <locale-dropdown />
                            <top-notifications />
                            <li class="dropdown profile-1">
                                <a class="nav-link leading-none d-flex" href="#" data-bs-toggle="dropdown">
                                    <img :src="user.photo_url" class="avatar profile-user brround cover-image" alt="profile"/>
                                </a>
                                <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <router-link :to="{ name: 'account.profile' }" class="dropdown-item">
                                        <i class="dropdown-icon mdi mdi-account-outline"></i>
                                        {{ $t('page.profile') }}
                                    </router-link>
                                    <a class="dropdown-item" @click.prevent="logout">
                                        <i class="dropdown-icon mdi  mdi-logout-variant"></i>
                                        {{ $t('page.logout') }}
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LocaleDropdown from './LocaleDropdown'
import TopNotifications from './TopNotifications.vue'

export default {
    name: 'Navbar',
    components: {
        LocaleDropdown,
        TopNotifications
    },

    data: () => ({
        appName: process.env.appName
    }),

    computed: mapGetters({
        user: 'auth/user',
        notifications: 'data/notifications',
        notification_count: 'data/notification_count',
    }),

    mounted() {
        // this.$store.dispatch('data/getNotifications');
    },

    methods: {
        toggleSidebar() {
            let body = document.body;
            if ((body.classList.contains('sidebar-toggle-display')) || (body.classList.contains('sidebar-absolute'))) {
                body.classList.toggle('sidebar-hidden');
            } else {
                body.classList.toggle('sidebar-icon-only');
            }
        },
        toggleSidebarActive() {
            this.$store.dispatch('data/activeSidebar')
        },
        async logout () {
            // Log out the user.
            await this.$store.dispatch('auth/logout')

            // Redirect to login.
            this.$router.push({ name: 'login' })
        }
    }
}
</script>
<style lang="scss" scoped>
    .desktop-logo {
        color: #FFF;
        font-family: 'Comforter', cursive;
        font-size: 34px !important;
    }
    .profile-user {
        object-fit: cover;
    }
</style>