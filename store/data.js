import axios from 'axios'

// state
export const state = () => ({
    companies: [],
    suppliers: [],
    categories: [],
    stores: [],
    notifications: [],
    notification_count: 0,
    sidenav_toggled: false,
    show_sidenav: false,
    is_mobile: window.innerWidth <= 768,
})

// getters
export const getters = {
    companies: state => state.companies,
    suppliers: state => state.suppliers,
    categories: state => state.categories,
    stores: state => state.stores,
    notifications: state => state.notifications,
    notification_count: state => state.notification_count,
    sidenav_toggled: state => state.sidenav_toggled,
    show_sidenav: state => state.show_sidenav,
    is_mobile: state => state.is_mobile,
}

// mutations
export const mutations = {
    GET_SUPPLIERS (state, data) {
        state.suppliers = data
    },
    GET_COMPANIES (state, data) {
        state.companies = data
    },
    GET_CATEGORIES (state, data) {
        state.categories = data
    },
    GET_STORES (state, data) {
        state.stores = data
    },
    GET_NOTIFICATIONS (state, data) {
        state.notifications = data.notifications
        state.notification_count = data.notification_count
    },
    TOGGLE_SIDEBAR (state, data) {
        if (data == 'toggle') {
            state.sidenav_toggled = !state.sidenav_toggled
        } else {
            state.sidenav_toggled = data
        }
    },
    SHOW_SIDENAV (state, data) {
        if (data == 'toggle') {
            state.show_sidenav = !state.show_sidenav
        } else {
            state.show_sidenav = data
        }
    },
    updateIsMobile(state) {
        state.isMobile = window.innerWidth <= 768; // Adjust the breakpoint as needed
    },
}

// actions
export const actions = {
    async getSuppliers ({ commit }) {
        const {data} = await axios.get('/get_suppliers')
        commit('GET_SUPPLIERS', data.data)
    },
    async getCompanies ({ commit }) {
        const {data} = await axios.get('/company/search');
        commit('GET_COMPANIES', data.data)
    },
    async getCategories ({ commit }) {
        const {data} = await axios.get('/category/search');
        commit('GET_CATEGORIES', data.data)
    },
    async getStores ({ commit }) {
        const {data} = await axios.get('/store/search');
        commit('GET_STORES', data.data)
    },
    getNotifications ({ commit }) {
        axios.get('/get_notifications').then(response => {
            commit('GET_NOTIFICATIONS', response.data.data)
        });
    },
    activeSidebar({ commit }, value = 'toggle') {
        commit('TOGGLE_SIDEBAR', value);
    },
    showSidenav({ commit }, value = 'toggle') {
        if (value != 'toggle') value = value && !this.is_mobile;
        commit('SHOW_SIDENAV', value);
    },
    initDevice({ commit }) {
        window.addEventListener('resize', () => commit('updateIsMobile'));
    },
}
