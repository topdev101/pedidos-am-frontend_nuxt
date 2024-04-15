<template>
    <div class="login-img">
        <div class="page h-100">
            <div class="">
                <nuxt />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AuthLayout',
    computed: {
        allowed_ips() {
            return this.$store.getters['auth/allowed_ips'];
        },
    },
    async mounted() {
        // this.getCurrentLocation();
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
        checkIp() {
            fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(response => {
                const clientIp = response.ip;
                if (this.allowed_ips.length && !this.allowed_ips.includes(clientIp)) {
                    return this.$router.push({name: 'login'});
                }
            });
        }
    }
}
</script>
