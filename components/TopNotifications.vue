<template>
    <li class="dropdown notifications">
        <a class="nav-link icon" data-bs-toggle="dropdown">
            <i class="mdi mdi-bell-outline"></i>
            <span v-if="unread_count" class="nav-unread badge badge-success badge-pill">{{ unread_count }}</span>
        </a>
        <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <div class="d-flex justify-content-between align-items-center p-3">
                <a href="#" class="fw-semibold fs-17">{{$t('page.notifications')}}({{unread_count}})</a>
                <span v-if="$isUser() && unread_count" class="badge bg-primary lh-base" @click="markAsRead()">{{$t('message.mark_as_read')}}</span>
            </div>
            <div class="dropdown-divider"></div>
            <div class="notifications-menu ps">
                <a v-for="(item, index) in notifications" :key="index" href="javascript:;" class="dropdown-item d-flex align-items-center px-3">
                    <div class="me-3 avatar avatar-md rounded-5 bg-success">
                        <i class="fe fe-shopping-cart"></i>
                    </div>
                    <div class="mt-1 wd-80p">
                        <p class="fs-15 mb-0 message">{{ message(item) }}</p>
                        <span class="fs-13">{{ $moment(item.created_at).fromNow() }}</span>
                    </div>
                </a>
                <div v-if="notifications.length === 0" class="notification-item text-center">{{ $t('page.no_data') }}</div>
                <div class="ps__rail-x" style="left: 0px; bottom: 0px;">
                    <div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px;"></div>
                </div>
                <div class="ps__rail-y" style="top: 0px; right: 0px;">
                    <div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 0px;"></div>
                </div>
            </div>
            <div class="dropdown-divider"></div>
            <div class="d-grid gap-2 px-2 py-1">
                <router-link :to="{name: 'notifications'}" class="btn btn-block btn-success">{{ $t('page.view_all_notifications') }}</router-link>
            </div>
        </div>
    </li>
</template>
<script>
export default {
    name: 'Notifications',
    data() {
        return {
            notifications: [],
            unread_count: 0,
        }
    },
    computed: {
        auth_user() {
            return this.$store.getters['auth/user'];
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            const response = await this.axios.get('/notification/search');
            if (response.data.status === 'Success') {
                this.notifications = response.data.data;
            }
            const unread_res = await this.axios.get('/notification/get_unread_notification_count');
            if (unread_res.data.status === 'Success') {
                this.unread_count = unread_res.data.data;
            }

        },
        async markAsRead() {
            const response = await this.axios.post('/notification/mark_as_read', {company_id: this.auth_user.company_id});
            if (response.data.status === 'Success') {
                this.unread_count = 0;
            }
        },
        message(item) {
            const message = item.message;
            switch (message) {
                case 'greater_discounted_order':
                    return this.$t('message.greater_discounted_order', {supplier: item.supplier.name, company: item.notifiable?.name});
                    break;
                default:
                    break;
            }
            return message
        }
    }
}
</script>
<style lang="scss" scoped>
    .notifications-menu {
        max-width: 400px;
        .dropdown-item {
            .avatar {
                min-width: 2.5rem;
            }
            p.message {
                white-space: normal;
            }
        }
    }
</style>