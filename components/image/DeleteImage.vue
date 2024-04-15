<template>
    <div class="d-flex align-items-center" v-viewer>
        <div class="image-container me-2" v-for="(img, index) in images" :key="index">
            <img v-if="img.mime === 'image'" :src="img.src" class="item-image" />
            <video v-else-if="img.mime === 'video'" :src="img.src" class="item-image"></video>
            <a v-else :href="img.src" target="_blank"><i class="ti-file" style="font-size: 30px;"></i></a>
            <i class="ti-close btn-delete"  @click="remove(img, index)"></i>
        </div>
    </div>
</template>
<script>
import 'viewerjs/dist/viewer.css'
import { directive as viewer } from "v-viewer"
import Swal from 'sweetalert2'
export default {
    props: ['images'],
    directives: {
        viewer: viewer({
            debug: true,
        }),
    },
    data() {
        return {
            serverUrl: process.env.serverUrl,
        };
    },
    methods: {
        remove(item, index) {
            Swal.fire({
                icon: 'warning',
                title: this.$t('message.are_you_sure'),
                reverseButtons: true,
                showCancelButton: true,
                confirmButtonText: this.$t('page.ok'),
                cancelButtonText: this.$t('page.cancel')
            }).then((result) => {
                if (result.isConfirmed) {
                    this.axios.delete(`/image/delete/${item.id}`).then(response => {
                        this.images.splice(index, 1);
                    })
                }
            })
        },
        downloadFile(item) {
            const url = item.src;
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('target', '_blank');
            link.setAttribute('download', 'download');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
</script>
<style lang="scss" scoped>
    .image-container {
        position: relative;
        img, video {
            width: 40px;
            height: 40px;
        }
        .btn-delete {
            position: absolute;
            top: 2px;
            right: 2px;
            font-size: 7px;
            color: #FFF !important;
            border-radius: 20px;
            display: block;
            width: 12px;
            height: 12px;
            line-height: 12px;
            text-align: center;
            background-color: #FF4747;
        }
    }
</style>