<template>
    <div class="ui-modal">
        <modal
            :name="name"
            :width="width"
            :height="height"
            :scrollable="scrollable"
            :adaptive="adaptive"
            @before-open="$emit('before-open')"
            @before-close="$emit('before-close')"
            @opened="$emit('opened')"
            @closed="$emit('closed')"
            :click-to-close="clickToClose"
        >
            <div class="ui--modal-content">
                <a v-if="showCloseButton" href="javascript:;" class="btn-close" @click.prevent="close()">
                    <i class="ti-close" />
                </a>
                <div v-if="showHeader" class="ui--modal-header">
                    <h6 v-if="title" class="ui--modal-title">{{ title }}</h6>
                    <slot name="header" />
                </div>
                <div class="ui--modal-body">
                    <slot />
                </div>
            </div>
        </modal>
    </div>
</template>
<script>
export default {
    name: 'ui-modal',
    props: {
        name: { type: String, required: true },
        width: { type: [String, Number], default: 500 },
        title: { type: String, default: '' },
        scrollable: { type: Boolean, default: true },
        adaptive: { type: Boolean, default: true },
        height: { type: [String, Number], default: 'auto' },
        clickToClose: { type: Boolean, default: false },
        showHeader: { type: Boolean, default: true },
        showCloseButton: { type: Boolean, default: true },
    },
    methods: {
        close() {
            this.$modal.hide(this.name);
            this.$emit('close');
        },
        open() {
            this.$modal.show(this.name);
            this.$emit('open');
        }
    }
}
</script>