<template>
    <form action="" method="post" @submit.prevent="submit()">
        <div class="row mx-n2">
            <div class="col-md-6 px-2 form-group">
                <label class="control-label">{{$t('page.reference_no')}}</label>
                <input class="form-control" type="text" v-model="form.reference" required :placeholder="$t('page.reference')" />
                <has-error :form="form" field="reference" />
            </div>
            <div class="col-md-6 px-2 form-group">
                <label class="control-label">{{$t('page.brand')}}</label>
                <input class="form-control" type="text" v-model="form.brand" required :placeholder="$t('page.brand')" />
                <has-error :form="form" field="brand" />
            </div>
            <div class="col-md-6 px-2 form-group">
                <label class="control-label">{{$t('page.vin')}}</label>
                <input class="form-control" type="text" v-model="form.vin" required :placeholder="$t('page.vin')" />
                <has-error :form="form" field="vin" />
            </div>
            <div class="col-md-6 px-2 form-group">
                <label class="control-label">{{$t('page.engine_number')}}</label>
                <input class="form-control" type="text" v-model="form.engine_number" required :placeholder="$t('page.engine_number')" />
                <has-error :form="form" field="engine_number" />
            </div>
            <div class="col-md-6 px-2 form-group">
                <label class="control-label">{{$t('page.exterior_color')}}</label>
                <input class="form-control" type="text" v-model="form.exterior_color" required :placeholder="$t('page.exterior_color')" />
                <has-error :form="form" field="exterior_color" />
            </div>
            <div class="col-md-6 px-2 form-group">
                <label class="control-label">{{$t('page.interior_color')}}</label>
                <input class="form-control" type="text" v-model="form.interior_color" required :placeholder="$t('page.interior_color')" />
                <has-error :form="form" field="interior_color" />
            </div>
            <div class="col-md-6 px-2 form-group">
                <label class="control-label">{{$t('page.purchased_city')}}</label>
                <input class="form-control" type="text" v-model="form.purchased_city" required :placeholder="$t('page.purchased_city')" />
                <has-error :form="form" field="purchased_city" />
            </div>

            <div class="col-md-6 px-2 form-group">
                <label class="control-label">{{$t('page.exchange_rate')}}</label>
                <input v-model="form.exchange_rate"
                    class="form-control"
                    type="text"
                    required
                    :placeholder="$t('page.exchange_rate')"
                    @keyup="changeUsdValue"
                />
                <has-error :form="form" field="exchange_rate" />
            </div>
            <div class="col-md-6 px-2 form-group">
                <label class="control-label">{{$t('page.sale_price')}}(USD)</label>
                <input v-model="form.sale_price"
                    class="form-control"
                    type="text"
                    required
                    :placeholder="$t('page.sale_price') + '(USD)'"
                    @keyup="changeUsdValue"
                />
            </div>
            <div class="col-md-6 px-2 form-group">
                <label class="control-label">{{$t('page.sale_price')}}(COP)</label>
                <input v-model="form.sale_price_cop"
                    class="form-control"
                    type="text"
                    required
                    :placeholder="$t('page.sale_price') + '(COP)'"
                    @keyup="changeCopValue"
                />
            </div>
        </div>
        <div class="form-group">
            <label class="control-label">{{$t('page.main_image')}}</label>
            <div class="custom-file">
                <input type="file" class="custom-file-input" id="mainImage" @change="handleMainImage" accept="image/*" />
                <label class="custom-file-label" for="mainImage">{{customMainFileName}}</label>
            </div>
        </div>
        <div class="form-group">
            <label class="control-label">{{$t('page.other_images')}}</label>
            <div class="custom-file">
                <input type="file" class="custom-file-input" id="otherImages" @change="handleFile" multiple accept="image/*, video/*" />
                <label class="custom-file-label" for="otherImages">{{customFileName}}</label>
            </div>
        </div>
        <hr class="my-2" />
        <div class="text-end">
            <button type="button" class="btn btn-danger" @click="closeModal('product_modal')"><i class="fe fe-x me-1"></i>{{$t('page.close')}}</button>
            <button type="submit" class="btn btn-primary ms-2" :class="{'btn-loading': form.busy}" :disabled="form.busy"><i class="fe fe-save me-1"></i>{{$t('page.save')}}</button>
        </div>
    </form>
</template>

<script>
import Form from "vform";
export default {
    props: ['mode', 'id'],
    data() {
        return {
            form: new Form({
                id: this.id,
                reference: '',
                brand: '',
                vin: '',
                engine_number: '',
                exterior_color: '',
                interior_color: '',
                purchased_city: null,
                main_image: null,
                images: null,
                sale_price: '',
                sale_price_cop: '',
                exchange_rate: '',
            }),
            customMainFileName: this.$t('page.choose_file'),
            customFileName: this.$t('page.choose_file'),
        };
    },
    mounted() {
        if (this.mode == 'edit') {
            this.getDetail()
        }
    },
    methods: {
        getDetail() {
            this.axios.get(`/product/get_detail/${this.id}`).then(response => {
                if (response.data.status == 'Success') {
                    let result = response.data.data;
                    this.form.reference = result.reference;
                    this.form.brand = result.brand;
                    this.form.vin = result.vin;
                    this.form.engine_number = result.engine_number;
                    this.form.interior_color = result.interior_color;
                    this.form.exterior_color = result.exterior_color;
                    this.form.purchased_city = result.purchased_city;
                    this.form.exchange_rate = result.purchase.exchange_rate;
                    this.form.sale_price = result.purchase.sale_price;
                    this.form.sale_price_cop = result.purchase.sale_price_cop;
                }
            });
        },
        submit() {
            let uri = this.mode == 'edit' ? '/product/update' : 'product/create';
            this.form.post(uri).then(response => {
                if (response.data.status == 'Success') {
                    this.$toast.success(this.$t('message.successfully_done'));
                    this.$emit('submit', response.data.data);
                }
            });
        },
        handleFile(event) {
            const fileName = event.target.value.split("\\").pop();
            this.customFileName = fileName;
            const files = event.target.files;
            this.form.images = files;
        },
        handleMainImage(event) {
            const fileName = event.target.value.split("\\").pop();
            this.customMainFileName = fileName;
            const files = event.target.files[0];
            this.form.main_image = files;
        },
        changeUsdValue() {
            const rate = this.form.exchange_rate;
            this.form.sale_price_cop = Math.round(this.form.sale_price * rate);
        },
        changeCopValue() {
            const rate = this.form.exchange_rate;
            this.form.sale_price = Math.round(this.form.sale_price_cop / rate);
        },
        closeModal(modalId) {
            this.$modal.hide(modalId);
        },
    }
}
</script>