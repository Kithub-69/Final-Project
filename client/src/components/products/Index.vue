<template>
  <div class="container">
    <main-header navsel="back"></main-header>
    <div class="product-header">
      <br />
      <br />
      <h2>ส่วนจัดการ Ipad</h2>


      <div class="create-product">
        <button class="btn btn-success btn-sm" v-on:click="navigateTo('/product/create')">Add Ipad</button>
        <strong>จํานวน Ipad:</strong>
        {{results.length}}
      </div>

      <ul class="categories">
        <li v-for="cate in category" v-bind:key="cate.index">
          <a v-on:click.prevent="setCategory(cate)" href="#">{{ cate }}</a>
        </li>
        <li class="clear">
          <a v-on:click.prevent="setCategory(' ')" href="#">Clear</a>
        </li>
      </ul>
      <div class="clearfix"></div>
    </div>
    <transition-group name="fade">
      <div v-for="product in products" v-bind:key="product.id" class="product-list">
        <!-- <p>id: {{ product.id }}</p> -->
        <div class="product-pic">
          <!-- <transition name="fade"> -->
          <div class="thumbnail-pic" v-if="product.thumbnail != 'null'">
            <img :src="BASE_URL+product.thumbnail" alt="thumbnail" />
          </div>
          <!-- </transition> -->
        </div>
        <h3>{{ product.title }}</h3>
        <!--<div v-html="product.content.slice(0,10) + '...'"></div>-->
        <div class="product-info">
          <p>
            <strong>Brand:</strong>
            {{ product.category }}
          </p>
          <p>
            <strong>Create:</strong>
            {{ product.createdAt }}
          </p>

          <p>
            <strong>Status:</strong>
            {{ product.prices | getNumberWithCommas }} 
          </p>
          <!-- <p>status: {{ product.status }}</p> -->
          <p>
            <button class="btn btn-primary" v-on:click="navigateTo('/product/'+ product.id)">View Ipad</button>
            <button
              class="btn btn-success"
              v-on:click="navigateTo('/product/edit/'+ product.id)"
            >Edit Ipad</button>
            <button class="btn btn-sm btn-danger" v-on:click="deleteProduct(product)">Delete</button>
          </p>
        </div>
        <div class="clearfix"></div>
      </div>
    </transition-group>
  </div>
</template>
<script>
import ProductsService from "@/services/ProductsService";
import _ from "lodash";
import ScrollMonitor from "scrollMonitor";

let LOAD_NUM = 5;
let pageWatcher;

export default {
  watch: {
    search: _.debounce(async function (value) {
      const route = {
        name: "products",
      };

      if (this.search !== "") {
        route.query = {
          search: this.search,
        };
      }

      console.log("search: " + this.search);
      this.$router.push(route);
    }, 700),

    "$route.query.search": {
      immediate: true,
      async handler(value) {
        this.products = [];
        this.results = [];
        this.loading = true;
        this.results = (await ProductsService.index(value)).data;
        this.appendResults();

        this.results.forEach((product) => {
          if (this.category.length > 0) {
            // console.log(this.category.indexOf(product.category))
            if (this.category.indexOf(product.category) === -1) {
              this.category.push(product.category);
            }
          } else {
            this.category.push(product.category);
          }
        });
        this.loading = false;
        this.search = value;
        //console.log(this.category)
      },
    },
  },
  data() {
    return {
      products: [],
      BASE_URL: "http://localhost:8081/assets/uploads/",
      search: "",
      results: [],
      category: [],
      loading: false,
    };
  },
  async created() {
    this.products = (await ProductsService.index()).data;
  },
  methods: {
    wait(ms) {
      return (x) => {
        return new Promise((resolve) => setTimeout(() => resolve(x), ms));
      };
    },
    appendResults: function () {
      if (this.products.length < this.results.length) {
        let toAppend = this.results.slice(
          this.products.length,
          LOAD_NUM + this.products.length // จำกัดการแสดงผล
        );
        this.products = this.products.concat(toAppend);
      }
    },
    navigateTo(route) {
      this.$router.push(route);
    },
    async deleteProduct(product) {
      try {
        await ProductsService.delete(product);
        this.refreshData();
      } catch (err) {
        console.log(err);
      }
    },
    async refreshData() {
      this.products = (await ProductsService.index()).data;
    },
    setCategory(keyword) {
      if (keyword === " ") {
        this.search = "";
        console.log("null");
      } else {
        this.search = keyword;
      }
    },
    updated() {
      let sens = document.querySelector("#product-list-bottom");
      pageWatcher = ScrollMonitor.create(sens);
      pageWatcher.enterViewport(this.appendResults);
    },
    beforeUpdated() {
      if (pageWatcher) {
        pageWatcher.destroy();
        pageWatcher = null;
      }
    },
  },
  filters: {
    getNumberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>
<style scoped>
.empty-product {
  width: 100%;
  text-align: center;
  padding: 4px;
  background: coral;
  color: white;
}
/* thumbnail */
.thumbnail-pic img {
  width: 200px;
  padding: 5px 10px 0px 0px;
}
.product-info {
  float: left;
}
.product-pic {
  float: left;
}
.clearfix {
  clear: both;
}
.product-list {
  border: solid 1px #dfdfdf;
  margin-bottom: 10px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.product-header {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

#product-list-bottom {
  padding-top: 4px;
}

#product-list-bottom {
  padding: 4px;
  text-align: center;
  color: white;
}
.categories {
  margin-top: 10px;
  padding: 0;
  list-style: none;
  float: left;
}
.categories li {
  float: left;
  padding: 2px;
}
.categories li a {
  padding: 5px 10px 5px 10px;
  background: paleturquoise;
  color: black;
  text-decoration: none;
}
.create-product {
  margin-top: 10px;
}
.categories li.clear a {
  background: tomato;
  color: white;
}
.product-load-finished {
  padding: 4px;
  text-align: center;
  background: seagreen;
  color: white;
}
.emptyproduct {
  background-color: coral;
  border-color: coral;
}
</style>