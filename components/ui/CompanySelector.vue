<template>
    <multiselect v-model="selected_company"
        :options="companies"
        :multiple="false"
        :preserve-search="true"
        :placeholder="$t('message.select_company')"
        label="name"
        track-by="id"
        :show-labels="false"
        :allow-empty="allowEmpty"
    >
        <span slot="noOptions" class="no_option_slot d-none"></span>
    </multiselect>
</template>
<script>
export default {
    name: 'ComapnySelector',
    props: {
        value: { type: [String, Number], required: true },
        allowEmpty: { type: Boolean, default: true },
    },
    data() {
        return {
            selected_company: null,
        };
    },
    computed: {
        companies() {
            return this.$store.getters['data/companies'];
        }
    },
    watch: {
        value(val) {
            this.selected_company = this.companies.find(i => i.id == val);
        },
        selected_company(val) {
            this.$emit('input', val ? val.id : null);
        }
    },
    mounted() {
        if (this.value) {
            this.selected_company = this.companies.find(i => i.id == this.value);
        }
    }
}
</script>