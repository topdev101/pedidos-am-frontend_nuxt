<template>
    <li class="dropdown">
        <a class="nav-link icon" data-bs-toggle="dropdown">
            <i class="mdi mdi-web"></i>
        </a>
        <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <ul class="header-dropdown-list">
                <li v-for="(value, key) in locales" :key="key" @click.prevent="setLocale(key)">
                    <div class="dropdown-item d-flex align-items-center position-relative">
                        <a href="javascript:void(0);" class="stretched-link"></a>
                        <!-- <img src="../assets/images/flags/french_flag.jpg" alt="flag-img" class="w-4 me-2"> -->
                        <span>{{ value }}</span>
                    </div>
                </li>
            </ul>
        </div>
    </li>
</template>

<script>
import { mapGetters } from 'vuex'
import { loadMessages } from '~/plugins/i18n'

export default {
  computed: mapGetters({
    locale: 'lang/locale',
    locales: 'lang/locales'
  }),

  methods: {
    setLocale (locale) {
      if (this.$i18n.locale !== locale) {
        loadMessages(locale)

        this.$store.dispatch('lang/setLocale', { locale })
      }
    }
  }
}
</script>
