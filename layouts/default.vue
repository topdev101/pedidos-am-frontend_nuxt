<template>
    <div class="page">
        <div class="page-main">
            <navbar v-if="auth_user" />
            <div class="sticky">
                <sidebar v-if="auth_user" />
            </div>
            <div class="jumps-prevent"></div>
            <div class="main-content side-content pt-0">
                <div class="side-app">
                    <nuxt />
                </div>
            </div>
        </div>
        <div v-if="is_mobile && !sidenav_toggled" class="sidebar-overlay" @click="hideSideMenu"></div>
    </div>
</template>

<script>
import Navbar from "~/components/Navbar";
import Sidebar from "~/components/Sidebar";
export default {
    name: 'LayoutDefault',
    components: {
        Navbar, Sidebar
    },
    head() {
        return {
            htmlAttrs: {
                'data-theme-color': 'light',
                'data-vertical-style': 'hover',
                'data-menu-style': 'dark',
                'data-header-style': 'light'
            },
            bodyAttrs: {
                class: this.bodyClass,
            }
        };
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        },
        sidenav_toggled() {
            return this.$store.getters['data/sidenav_toggled'];
        },
        show_sidenav() {
            return this.$store.getters['data/show_sidenav'];
        },
        bodyClass() {
            let bodyClass = 'app sidebar-mini Left-menu-Default Sidemenu-left-icons';
            if (!this.sidenav_toggled) {
                bodyClass = 'app sidebar-mini Left-menu-Default Sidemenu-left-icons sidenav-toggled';
                if (this.show_sidenav) {
                    bodyClass = 'app sidebar-mini Left-menu-Default Sidemenu-left-icons sidenav-toggled show-sidenav';
                }
            }
            return bodyClass;
        },
        allowed_ips() {
            return this.$store.getters['auth/allowed_ips'];
        },
        is_mobile() {
            return this.$store.getters['data/is_mobile'];
        }
    },
    watch:{
        $route (to, from){
            this.$store.dispatch('data/activeSidebar', this.is_mobile || false)
        }
    },
    async mounted() {
        this.$store.dispatch('data/initDevice');
        this.$store.dispatch('data/getCompanies');
        this.$store.dispatch('data/activeSidebar', this.is_mobile || false)
    },
    methods: {
        getCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.getPosition);
            } else {
                alert("Geolocation is not supported by this browser. \n Please enable it.");
            }
        },
        getPosition(position) {
            var currentLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };
            let payload = {
                type: "latlng",
                params: `${currentLocation.latitude},${currentLocation.longitude}`,
            };
            this.axios.post(`/get_google_map_address`, payload).then((response) => {
                if (response.data.status === "Success") {
                    let location = response.data.data;
                    // currentLocation.country = location.country;
                    // currentLocation.city = location.city;
                    // currentLocation.state = location.state;
                    // currentLocation.county = location.county;
                    // currentLocation.zipcode = location.zipcode;
                    // currentLocation.address = location.address;
                    // currentLocation.full_address = location.full_address;
                }
            });
        },
        hideSideMenu() {
            this.$store.dispatch('data/activeSidebar', true);
        }
    }
};
</script>
<style lang="scss" scoped>
    @media (min-width: 992px) {
        .sidebar-mini.sidenav-toggled {
            .main-content.side-content {
                margin-inline-start: 100px;
            }
            .main-header.side-header {
                padding-inline-start: 160px;
            }
        }
    }
    .sidebar-overlay {
        position: fixed;
        z-index: 8;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.3);
    }
    @media (max-width: 768px) {
        .jumps-prevent {
            padding-top: 64px;
        }
    }
</style>
