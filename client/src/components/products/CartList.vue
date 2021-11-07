<template>
  <div>
    <main-header navsel="back"></main-header>
    <div class="container">
      <div class="cartlist-warpper">
        <!-- cart info -->
        <div v-if="transections.length" class="cart-info container">
          <div class="rows">
            <div class="col-md-12">
              <div class="transection-wrapper">
                <h4>
                  รายละเอียดการจอง
                </h4>
                <ul class="trasection-list">
                  <li v-for="transection in transections" v-bind:key="transection.id">
                    <h4>
                      {{ transection.producttitle }} จํานวน {{ transection.qty}} x {{ transection.prices }}
                    </h4>
                    <h4>email: {{ transection.email }}</h4>
                    <h4>
                      ชื่อ: {{ transection.username }} {{ transection.userlastname }}
                    </h4>
                    <p>
                      <strong>จำนวน :</strong>
                      {{ transection.qty  }} เครื่อง
                    </p>
                    <p>
                      <strong>สถานะลูกค้า :</strong> <span style="color: red;" v-if="transection.clientStatus == 'ไม่อนุมัติ'">{{ transection.clientStatus }} </span> <span style="color: green;" v-if="transection.clientStatus == 'ยืนยันการยืม'">{{ transection.clientStatus }} </span> <span style="color: blue;" v-if="transection.clientStatus == 'รอตรวจสอบการชำระเงิน'">{{ transection.clientStatus }} </span> <span  v-if="transection.clientStatus == 'รอการยืนยัน'">{{ transection.clientStatus }} </span> [<a v-on:click.prevent="updateclientStatus(transection.id)" href=""> ไม่อนุมัติ </a> <a v-on:click.prevent="updateclientStatusf(transection.id)" href=""> ยืนยันการยืม </a>]
                    </p>

                      <div class="thumbnail-pic" v-if="transection.pictures != 'null'">
                        <div class="container">
                      <input type="checkbox" id="zoomCheck">
                      <label for="zoomCheck">
                        <img class="img-thumbnail" height="120px" width="170px" :src="BASE_URL+transection.pictures" alt="thumbnail">
                        </label>
                        </div>
                      </div>

                   
                    <p>
                    <transition name="fade">
                      <div class="thumbnail-pic" v-if="transection.trackingnumber == 'null' || transection.trackingnumber == ''">
                        
                      </div>
                    </transition>
                    <p>
                    <p>
                      <transition name="fade">
                        <div class="thumbnail-pic" v-if=" buy.edit == 'true' && transection.id == buy.idtrackingnumber">
                          <strong>Edit Serial Number :</strong> <input class="" type="text" v-model="buy.trackingnumber">
                        </div>
                      </transition>
                    <p>  
                    <p>
                    <transition name="fade">
                      <div class="thumbnail-pic" v-if="transection.trackingnumber != 'null' && transection.trackingnumber != ''">
                        <strong>Serial Number :</strong> {{ transection.trackingnumber }}
                      </div>
                    </transition>
                    </p>
                    <p>
                      <button  v-if="(buy.trackingnumber != '' && transection.id == buy.idtrackingnumber) || (transection.trackingnumber == 'null' && buy.trackingnumber != '')" v-on:click.prevent="sendSent(transection.id)" class="btn btnxs btn-success">ยืนยันการส่ง</button>
                      <button  v-if="transection.trackingnumber != 'null' && transection.trackingnumber != ''" v-on:click.prevent="edit(transection.id)" class="btn btnxs btn-warning">Edit Trackingnumber </button>
                      <button  v-if="buy.edit == 'true' && transection.id == buy.idtrackingnumber" v-on:click.prevent="editfalse(transection.id)" class="btn btnxs btn">ปิด </button>
                    </p>
                    <p>
                      <strong>วันที่ :</strong>
                      {{ transection.createdAt |
                      formatedDate }}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="container">
          <div class="trasection-null">ไม่มีรายการสั่งซื้อขณะนี้</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import BuysService from "@/services/BuysService";
import UploadService from "@/services/UploadService";
import moment from "moment";
const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;
export default {
  filters: {
    formatedDate(value) {
      return moment(String(value)).format("DD-MM-YYYY");
    },
    getNumberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  data() {
    return {
      transections: [],
      buy: {
        trackingnumber: "",
        edit: "false",
        cheakshow:"false",
        idshow: "",
        idtrackingnumber: "null",
      },
      
      BASE_URL: "http://localhost:8081/assets/uploads/",
      error: null,
      // uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "userPhoto",
      uploadedFileNames: [],
      pictures: [],
      
    };
  },
  async created() {
    this.refreshData();
  },
  methods: {
    async refreshData() {
      this.transections = (await BuysService.index()).data;
    },
    async sendSent(id) {
      let transection = {
        id: id,
        shopStatus: "ส่งแล้ว",
        trackingnumber: this.buy.trackingnumber
      };
      this.buy.edit = "false"
      this.buy.trackingnumber = ""
      try {
        await BuysService.put(transection);
        this.refreshData();
      } catch (error) {
        console.log(error);
      }
    },
    async updateclientStatus(id) {
      let transection = {
        id: id,
        clientStatus: "ไม่อนุมัติ",
      };
      try {
        await BuysService.put(transection);
        this.refreshData();
      } catch (error) {
        console.log(error);
      }
    },
    async updateclientStatusf(id) {
      let transection = {
        id: id,
        clientStatus: "ยืนยันการยืม",
      };
      try {
        await BuysService.put(transection);
        this.refreshData();
      } catch (error) {
        console.log(error);
      }
    },
    edit(id){
      this.buy.idtrackingnumber = id
      this.buy.edit = "true"
      this.buy.trackingnumber = ""
      
    },
    editfalse(id){
      this.buy.idtrackingnumber = id
      this.buy.edit = "false"
      this.buy.trackingnumber = ""
      
    },
    cheakshow(id){
      this.buy.idshow = id
      this.buy.cheakshow = "true"
    },
    cheakshowfalse(id){
      this.buy.idshow = id
      this.buy.cheakshow = "false"
    }
  },
  
  
};
</script>

<style scoped>
.cartlist-warpper {
  margin-top: 80px;
}
.trasection-null {
  border: solid 1px #dfdfdf;
  margin-bottom: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  margin-top: 30px;
}
.user-info h1 {
  text-align: center;
}
.trasection-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.trasection-list li {
  border: solid 1px #dfdfdf;
  margin-bottom: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.cart-info {
  margin-top: 50px;
  font-family: kanit;
}
/* thumbnail */
.thumbnail-pic img{
  width:200px;
  margin-bottom: 10px;
}
input[type=checkbox] {
  display: none;
}

.container img {
  margin: 0px;
  transition: transform 0.25s ease;
  cursor: zoom-in;
}

input[type=checkbox]:checked ~ label > img {
  transform: scale(4);
  cursor: zoom-out;
}
</style>