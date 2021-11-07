<template>
  <div id="carlist">
    <!-- new navbar -->
    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand navbar-link" href="#" von:click.prevent="navigateTo('/dashboard')">
            <img src="@/assets/3829187415_175d7b5c-a417-40ae-ac27-dacf8a95ff03.png" id="logo" />
          </a>
          <button class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navcol-1">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="iconbar"></span>
            <span class="icon-bar"></span>
          </button>
        </div>
        <div class="collapse navbar-collapse" id="navcol-1">
          <ul class="nav navbar-nav navbar-right">
            <li role="presentation">
              <router-link :to="{name: 'front'}">
                <i class="fas fa-home"></i> Home
              </router-link>
            </li>
            <li role="presentation">
              <router-link :to="{name: 'front-products'}">
              <i class="fas fa-shopping-bag"></i> Order Now
              </router-link>
            </li>
            <li v-if="!isUserLoggedIn" role="presentation">
              <a href="#" v-on:click.prevent="showLogin = true ;showRegister=false">Login</a>
            </li>
            <transition name="fade">
              <li v-if="isUserLoggedIn" role="presentation">
                <router-link v-bind:to="{name: 'cartlist'}">{{users.name}}</router-link>
              </li>
            </transition>
            <li v-if="isUserLoggedIn" role="presentation">
              <a href="#" v-on:click.prevent="logout">Logout</a>
            </li>
            <li v-if="!isUserLoggedIn" role="presentation">
              <a href="#" v-on:click.prevent="showRegister = true ;showLogin = false">Register</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="modal" v-if="showRegister">
      <transition name="fade">
        <div class="login-wrapperr">
          <h3>Register</h3>
          <form v-on:submit.prevent="clientRegister" class="formhorizontal">
            <div class="form-group">
              <label class="control-label col-md-3">Email:</label>
              <div class="col-md-9">
                <input
                  required
                  placeholder="email"
                  type="email"
                  v-model="client.email"
                  class="form-control"
                /><br>
              </div>
            </div>

            <div class="form-group">
              <label class="control-label col-md-3">Password:</label>
              <div class="col-md-9">
                <input
                  required
                  type="password"
                  placeholder="password"
                  v-model="client.password"
                  class="form-control"
                /><br>
              </div>
              <br>
            </div>
            


            <div class="form-group">
              <label class="control-label col-md-3">Name:</label>
              <div class="col-md-9">
                <input
                  required
                  type="text"
                  placeholder="name"
                  v-model="client.name"
                  class="form-control"
                /><br>
              </div>
            </div>

            <div class="form-group">
              <label class="control-label col-md-3">Lastname:</label>
              <div class="col-md-9">
                <input
                  required
                  type="password"
                  placeholder="password"
                  v-model="client.lastname"
                  class="form-control"
                /><br>
              </div>
              <br>
            </div>

            <div class="form-group">
              <label class="control-label col-md-3">Address:</label>
              <div class="col-md-9">
                <input
                  required
                  type="text"
                  placeholder="lastname"
                  v-model="client.address "
                  class="form-control"
                /><br>
              </div>
            
  
            </div><br>
            <div class="form-group">
              <div class="col-md-offset-3 col-md-9">
                <button class="btn btn-success btn-sm" type="submit">
                  <i class="fas fa-key"></i> Register
                </button>
                <button
                  v-on:click.prevent="showRegister = false"
                  class="btn btn-danger btn-sm"
                  type="button"
                >
                  <i class="fas fa-timescircle"></i> Close
                </button>
              </div>
            </div>
            <div class="error">
              <p v-if="error">{{error}}</p>
            </div>
          </form>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div v-if="resultUpdated != ''" class="popup-msg">
        <p>{{ resultUpdated }}</p>
      </div>
    </transition>
    <div class="modal" v-if="showLogin ">
      <transition name="fade">
        <div class="login-wrapper">
          <h3>Client Login</h3>
          <form v-on:submit.prevent="clientLogin" class="formhorizontal">
            <div class="form-group">
              <label class="control-label col-md-3">Email:</label>
              <div class="col-md-9">
                <input placeholder="email" type="email" v-model="email" class="form-control" />
              </div>
            </div>
            <br>
            <br>
            <div class="form-group">
              <label class="control-label col-md-3">Password: &nbsp; &nbsp;   </label> 
              <div class="col-md-9">
                <input
                  type="password"
                  placeholder="password"
                  v-model="password"
                  class="form-control"
                />
              </div>
            </div>
            <br>
            <div class="form-group">
              <div class="col-md-offset-3 col-md-9">
                <button class="btn btn-success btn-sm" type="submit">
                  <i class="fas fa-key"></i> Login
                </button>
                <button
                  v-on:click.prevent="showLogin = false"
                  class="btn btn-danger btn-sm"
                  type="button"
                >
                  <i class="fas fa-timescircle"></i> Close
                </button>
              </div>
            </div>
            <div class="error">
              <p v-if="error">{{error}}</p>
            </div>
          </form>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div v-if="resultUpdated != ''" class="popup-msg">
        <p>{{ resultUpdated }}</p>
      </div>
    </transition>
    
    <div class="user-info">
      <br />
      <br />
      <h1>แสดงข้อมูลผู้ใช้งาน</h1>
      <div class="form-wrapper" v-if="user != null && users != null">
        <div class="form-horizontal">
          <div class="form-group">
            <label for class="control-label col-md-2">Name:</label>
            <div class="col-md-8">
              <input
                class="form-control"
                type="text"
                v-model="users.name"
                disabled
              />
            </div>
          </div>
          <div class="form-group">
            <label for class="control-label col-md-2">Lastname:</label>
            <div class="col-md-8">
              <input
                class="form-control"
                type="text"
                v-model="users.lastname"
                disabled
              />
            </div>
          </div>
          <div class="form-group">
            <label for class="control-label col-md-2">Email:</label>
            <div class="col-md-8">
              <input
                class="form-control"
                type="email"
                v-model="users.email"
                disabled
              />
            </div>
          </div>
          <div class="form-group">
            <label for class="control-label col-md-2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
            &nbsp;&nbsp;&nbsp;<button class="btn btn-sm btn-warning" v-on:click="navigateTo('/front/edit/'+ user.id)">แก้ไขข้อมูล</button>

          </div>
        </div>
      </div>
    </div>
    
    <!-- cart info -->
    <div v-if="transections.length" class="cart-info container">
      <div class="rows">
        <div class="col-md-12">
          <div class="transection-wrapper">
            <h4>รายละเอียดการสั่ง</h4>
            <ul class="trasection-list">
              <li class="lii" v-for="transection in transections" v-bind:key="transection.id" >
                <h4> {{ transection.producttitle }} 
                </h4>
                <p>
                  <strong>จำนวน :</strong> {{ (transection.qty * transection.prices) | getNumberWithCommas }}เครื่อง
                </p>
                <p>
                  <strong>สถานะลูกค้า :</strong> <span style="color: red;" v-if="transection.clientStatus == 'ไม่อนุมัติ'">{{ transection.clientStatus }} </span> <span style="color: green;" v-if="transection.clientStatus == 'ยืนยันการยืม'">{{ transection.clientStatus }} </span> <span style="color: blue;" v-if="transection.clientStatus == 'รอตรวจสอบการชำระเงิน'">{{ transection.clientStatus }} </span> <span  v-if="transection.clientStatus == 'รอการยืนยัน'">{{ transection.clientStatus }} </span>
                </p>
                <p>
                  <table>
                    <tr>
                      <td>
                        <div>
                          <form enctype="multipart/form-data" novalidate>
                              <div class="dropbox">
                                  <input type="file" multiple :name="uploadFieldName"
                                  :disabled="isSaving" @change="filesChange($event.target.name,
                                  $event.target.files); fileCount = $event.target.files.length"
                                  accept="image/*" class="input-file">
                              </div>
                          </form>
                        </div>
                      </td>
                      <td>

                      </td>
                    </tr>
                  </table>
                  
                </p>
                <transition-group  name="fade" >    
                  <li   v-for="picture in pictures" v-bind:key="picture.id">    
                    <button class="btn btn-xs btn-info"  v-if="pictures.length == picture.id && pictures.name != buy.pictures" v-on:click.prevent="useThumbnail(transection.id,picture.name)">ยืนยัน</button>
                  </li>  
                </transition-group>
            

                  <transition name="fade" v-if="buy.cheakshow != 'false' && transection.id == buy.idshow">
                    <div class="thumbnail-pic" v-if="transection.pictures != 'null' || buy.cheakshow == 'true'">
                      <div class="container">
                      <input type="checkbox" id="zoomCheck">
                      <label for="zoomCheck">
                      <img class="img-thumbnail"  height="120px" width="170px" :src="BASE_URL+transection.pictures" alt="thumbnail">
                      </label>
                        </div>
                    </div>
                  </transition>
    
                  
                  <div>
                    <div class="clearfix"></div>
                  </div>  

                
                
                <p>
                  <transition name="fade">
                    <div class="thumbnail-pic" v-if="transection.trackingnumber != 'null' && transection.trackingnumber != '' ">
                      <strong>trackingnumber :</strong> {{ transection.trackingnumber }}         
                    </div>
                  </transition>
                </p>
                <p>
                  <strong>วันที่ :</strong> {{ transection.createdAt | formatedDate }} 
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="container">
      <div class="trasection-null">ไม่มีรายการสั่งซื้อขณะนี้</div>
    </div><br><br><br><br><br><br><br><br><br><br><br><br><br>
      <!-- Site footer -->
    
  </div>
</template>
<script>
import { mapState } from "vuex";
import BuysService from "@/services/BuysService";
import AuthenService from "@/services/AuthenService";
import UsersService from "@/services/UsersService";
import moment from "moment";
import UploadService from "@/services/UploadService";
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
  computed: {
    ...mapState(["isUserLoggedIn", "user"]),
  },
  data() {
    return {
      email: "",
      password: "",
      error: "",
      showLogin: false,
      resultUpdated: "",
      showRegister: false,
      client: {
        name: "",
        lastname: "",
        email: "",
        password: "",
        address: "",
        status: "active",
        type: "user",
      },
      transections: [],
      users: null,
      BASE_URL: "http://localhost:8081/assets/uploads/",
      error: null,
      // uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "userPhoto",
      uploadedFileNames: [],
      pictures: [],
      pictureIndex: 0,
      buy: {
        pictures: "null",
        cheakshow: "",
        idshow: "",
        userId: 0,
      },

      check: "false",
      number: 0,
    };
  },
  async created() {
    this.transections = (await BuysService.user(this.user.id)).data;
    try {
      let userId = this.$route.params.userId;
      if (userId != "") {
        this.users = (await UsersService.show(userId)).data;
      }
    } catch (error) {
      console.log(error);
    }
    console.log(this.transections);
  },
  mounted() {
    if (!this.isUserLoggedIn) {
      alert("Please, Register or Login before.\n\nThank you.");
      this.$router.push({
        name: "front",
      });
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("setToken", null);
      this.$store.dispatch("setUser", null);
      // this.$router.push({
      // name: 'login'
      // })
      this.resultUpdated = "Logout successful.";
      setTimeout(() => (this.resultUpdated = ""), 3000);
    },
    navigateTo(route) {
      this.$router.push(route);
    },
    async clientLogin() {
      console.log(`acc: ${this.email} - ${this.password}`);
      try {
        const response = await AuthenService.clientLogin({
          email: this.email,
          password: this.password,
        });
        this.error = "";
        this.$store.dispatch("setToken", response.data.token);
        this.$store.dispatch("setUser", response.data.user);
        // this.$router.push({
        // name: 'blogs'
        // })
        // console.log(response.data)
        (this.email = ""), (this.password = ""), (this.showLogin = false);
        this.resultUpdated = "Login successful.";
        setTimeout(() => (this.resultUpdated = ""), 3000);
      } catch (error) {
        console.log(error);
        this.error = error.response.data.error;
        this.email = "";
        this.password = "";
        setTimeout(() => (this.error = ""), 3000);
      }
    },
    async clientRegister() {
      console.log(this.client);
      try {
        await UsersService.post(this.client);
        this.client = {};
        this.showRegister = false;
        this.resultUpdated = "Register successful, Please login first.";
        setTimeout(() => (this.resultUpdated = ""), 5000);
      } catch (error) {
        console.log(error);
        this.client = {};
        this.error = error.response.data.error;
        setTimeout(() => (this.error = ""), 5000);
      }
    },
    async sendPaid(id) {
      let transection = {
        id: id,
        clientStatus: "รอตรวจสอบการชำระเงิน",
        pictures: this.buy.pictures,
      };
      try {
        await BuysService.put(transection);
        this.check = "true";
        this.refreshData();
      } catch (error) {
        console.log(error);
      }
    },
    async useThumbnail(id, filename) {
      //console.log(filename)
      this.buy.pictures = filename;
      let transection = {
        id: id,
        pictures: filename,
      };
      try {
        await BuysService.put(transection);
        this.check = "true";
        this.refreshData();
      } catch (error) {
        console.log(error);
      }
    },
    async delFile(material) {
      let result = confirm("Want to delete?");
      if (result) {
        let dataJSON = {
          filename: material.name,
        };

        await UploadService.delete(dataJSON);

        for (var i = 0; i < this.pictures.length; i++) {
          if (this.pictures[i].id === material.id) {
            this.pictures.splice(i, 1);
            this.materialIndex--;
            break;
          }
        }
      }
    },
    async refreshData() {
      this.transections = (await BuysService.user(this.user.id)).data;
      this.users = (await UsersService.index()).data;
    },
    async save(formData) {
      // upload data to the server
      try {
        this.currentStatus = STATUS_SAVING;
        await UploadService.upload(formData);
        this.currentStatus = STATUS_SUCCESS;

        // update image uploaded display
        let pictureJSON = [];
        this.uploadedFileNames.forEach((uploadFilename) => {
          let found = false;
          for (let i = 0; i < this.pictures.length; i++) {
            if (this.pictures[i].name == uploadFilename) {
              found = true;
              break;
            }
          }

          if (!found) {
            this.pictureIndex++;
            this.number++;
            let pictureJSON = {
              id: this.pictureIndex,
              name: uploadFilename,
            };
            this.pictures.push(pictureJSON);
          }
        });
      } catch (error) {
        console.log(error);
        this.currentStatus = STATUS_FAILED;
      }
    },
    filesChange(fieldName, fileList) {
      // handle file changes
      const formData = new FormData();

      if (!fileList.length) return;

      // append the files to FormData
      Array.from(Array(fileList.length).keys()).map((x) => {
        formData.append(fieldName, fileList[x], fileList[x].name);
        this.uploadedFileNames.push(fileList[x].name);
      });
      // save it
      this.save(formData);
    },
    cheakshow(id) {
      this.buy.idshow = id;
      this.buy.cheakshow = "true";
    },
    cheakshowfalse(id) {
      this.buy.idshow = id;
      this.buy.cheakshow = "false";
    },
  },
  computed: {
    ...mapState(["isUserLoggedIn", "user"]),
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    },
  },
};
</script>
<style scoped>
.user-info h1 {
  text-align: center;
}
.trasection-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.trasection-list .lii {
  border: solid 1px #dfdfdf;
  margin-bottom: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.cart-info {
  margin-top: 50px;
}
.trasection-null {
  border: solid 1px #dfdfdf;
  margin-bottom: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  margin-top: 30px;
}
.error {
  color: red;
  text-align: center;
}
.popup-msg {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  border: solid 1px #ddd;
  background: #fff;
  max-width: 200px;
  padding: 10px;
  position: fixed;
  bottom: 0;
  right: 0;
  border-radius: 5px;
  margin-bottom: 5px;
  margin-right: 5px;
}
.navbar-brand > img {
  width: 40px;
  padding: 12px 0;
  margin-top: -16px;
}
.navbar-inverse {
  height: 60px;
  background-color: #112b83;
}
.navbar-inverse .navbar-nav > li > a {
  font-size: 20px;
  margin-top: 5px;
  color: #ffffff;
}
.modal {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 10; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}
.login-wrapper {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  border: solid 1px #ddd;
  width: 360px;
  height: 230px;
  padding: 10px 30px 20px 30px;
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  /* padding: 20px; */
}
.login-wrapperr {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  border: solid 1px #ddd;
  width: 360px;
  height: 380px;
  padding: 10px 30px 20px 30px;
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  /* padding: 20px; */
}
.login-wrapper h3 {
  text-align: center;
  padding-bottom: 10px;
}
.site-footer
{
  background-color:#26272b;
  padding:45px 0 20px;
  font-size:16px;
  line-height:24px;
  color:#737373;
}
.site-footer hr
{
  border-top-color:#bbb;
  opacity:0.5
}
.site-footer hr.small
{
  margin:20px 0
}
.site-footer h6
{
  color:#fff;
  font-size:20px;
  text-transform:uppercase;
  margin-top:5px;
  letter-spacing:2px
}
.site-footer a
{
  color:#737373;
}
.site-footer a:hover
{
  color:#3366cc;
  text-decoration:none;
}
.footer-links
{
  padding-left:0;
  list-style:none
}
.footer-links li
{
  display:block
}
.footer-links a
{
  color:#737373
}
.footer-links a:active,.footer-links a:focus,.footer-links a:hover
{
  color:#3366cc;
  text-decoration:none;
}
.footer-links.inline li
{
  display:inline-block
}
.site-footer .social-icons
{
  text-align:right
}
.site-footer .social-icons a
{
  width:40px;
  height:40px;
  line-height:40px;
  margin-left:6px;
  margin-right:0;
  border-radius:100%;
  background-color:#33353d
}
.copyright-text
{
  margin:0
}
@media (max-width:991px)
{
  .site-footer [class^=col-]
  {
    margin-bottom:30px
  }
}
@media (max-width:767px)
{
  .site-footer
  {
    padding-bottom:0
  }
  .site-footer .copyright-text,.site-footer .social-icons
  {
    text-align:center
  }
}
.social-icons
{
  padding-left:0;
  margin-bottom:0;
  list-style:none
}
.social-icons li
{
  display:inline-block;
  margin-bottom:4px
}
.social-icons li.title
{
  margin-right:15px;
  text-transform:uppercase;
  color:#96a2b2;
  font-weight:700;
  font-size:13px
}
.social-icons a{
  background-color:#eceeef;
  color:#818a91;
  font-size:16px;
  display:inline-block;
  line-height:44px;
  width:44px;
  height:44px;
  text-align:center;
  margin-right:8px;
  border-radius:100%;
  -webkit-transition:all .2s linear;
  -o-transition:all .2s linear;
  transition:all .2s linear
}
.social-icons a:active,.social-icons a:focus,.social-icons a:hover
{
  color:#fff;
  background-color:#29aafe
}
.social-icons.size-sm a
{
  line-height:34px;
  height:34px;
  width:34px;
  font-size:14px
}
.social-icons a.facebook:hover
{
  background-color:#3b5998
}
.social-icons a.twitter:hover
{
  background-color:#00aced
}
.social-icons a.linkedin:hover
{
  background-color:#007bb6
}
.social-icons a.dribbble:hover
{
  background-color:#ea4c89
}
@media (max-width:767px)
{
  .social-icons li.title
  {
    display:block;
    margin-right:0;
    font-weight:600
  }
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
  transform: scale(5);
  cursor: zoom-out;
}
</style>