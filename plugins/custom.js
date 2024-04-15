import Vue from 'vue'

import VModal from 'vue-js-modal/dist/index.nocss.js'
import 'vue-js-modal/dist/styles.css'
Vue.use(VModal)

import Paginate from 'vuejs-paginate'
Vue.component('paginate', Paginate)

import Multiselect from 'vue-multiselect'
Vue.component('multiselect', Multiselect)

import InfiniteLoading from 'vue-infinite-loading'
Vue.component('infinite-loading', InfiniteLoading);

import loading from 'vuejs-loading-screen'
Vue.use(loading, {
    bg: '#41b883ad',
    slot: `<div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
    </div>`
})

import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
Vue.use(VueToast, {
    position: 'top',
    duration: 5000,
});


import UiModal from '@/components/ui/Modal.vue';
Vue.component('ui-modal', UiModal)