<template>
<div>
    <main-header navsel="front"></main-header>
    <div class="component-wrapper container">
        <main-header navsel="front"></main-header>
        <div v-if="blog" >
            <div class="hero-wrapper">
            </div>
            <div class="blog-wrapper" v-if="blog != null">
                <h1>{{ blog.title }}</h1>
                <p><strong>Category: </strong>: <a href="#" v-on:click.prevent="navigateTo(`/front?search=${blog.category}`)">{{blog.category }}</a></p>
                <div class="content" v-html="blog.content"></div>
                <!-- <p>category: {{ blog.category }}</p>
                <p>status: {{ blog.status }}</p> -->
            </div>
            <div class="back-nav"><button class="btn btn-success" v-on:click="navigateTo('/front')"><i class="fas fa-arrow-left"></i> Back..</button></div>


            <br>
        </div>
    </div>
    <!-- Site footer -->
    <footer class="site-footer">
      <div class="container">
        <div class="row">
          <div class="col-sm-12 col-md-6">
            <h6>About</h6>
            <p class="text-justify">com-gt.com <i>เป็นเว็บไซต์ที่เอาไว้จัดจำหน่ายอุปกรณ์คอมพิวเตอร์ทางออนไลน์ </i>สำหรับคนที่มีความต้องการซื้ออุปกรณ์คอมพิวเตอร์แต่ไม่สามารถเดินทางออกมาซื้อที่หน้าร้านได้เว็บไซต์เราจึงเป็นอีกหนึ่งทางเลือกที่จะช่วยให้ลูกค้าสะดวกสบายมากยิ่งขึ้น
</p>
          </div>

          <div class="col-xs-6 col-md-3">
            <h6>Categories</h6>
            <ul class="footer-links">
              <li v-for="cate in category" v-bind:key="cate.index">
              <a v-on:click.prevent="setCategory(cate)" href="#">{{ cate }}
            </a></li>
            </ul>
          </div>

          <div class="col-xs-6 col-md-3">
            <h6>Quick Links</h6>
            <ul class="footer-links">
              <router-link :to="{name: 'front'}">
                <i class="fas fa-home"></i> Home
              </router-link><br>
              <router-link :to="{name: 'front-products'}">
              <i class="fas fa-shopping-bag"></i> Order Now
              </router-link>
            </ul>
          </div>
        </div>
        <hr>
      </div>
      <div class="container">
        <div class="row">
          <div class="col-md-8 col-sm-6 col-xs-12">
            <p class="copyright-text">Copyright &copy; 2020 All Rights Reserved by 
         <a href="#">Com-gt</a>.
            </p>
          </div>
        </div>
      </div>
</footer>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import BlogsService from '@/services/BlogsService'
    import UsersService from '@/services/UsersService'
    import CommentComp from '@/components/Fronts/Comment'

    export default {
        data () {
            return {
                blog: null,
                resultUpdated: '',
                users:null,
            }
        },
        components : {
            CommentComp
        },
        async created () {
            // get blog
            // check permission first
            try {
                let blogId = this.$route.params.blogId
                this.blog = (await BlogsService.show(blogId)).data
            } catch (error) {
                console.log (error)
            }
            },
            methods: {
                navigateTo (route) {
                this.$router.push(route)
                }
            },
            computed: {
                ...mapState([
                    'isUserLoggedIn',
                    'user'
                ])
            }
    }
</script>
<style scoped>
    .hero {
        margin-top: 80px;
        border-radius: 5px;
        background: darkcyan;
        height:250px;
        color:white;
        padding: 20px;
    }
    .hero h1 {
        margin-top: 30px;
    }
    .blog-wrapper {
        margin-top:20px;
        padding: 40px;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
    }
    .back-nav {
        margin-top: 20px;
        text-align: center;
    }
    .blog-wrapper h1{
        text-align: center;
        font-family: 'kanit';
        padding-bottom: 50px;
    }
    .blog-wrapper p {
        font-family: 'kanit';
        font-size: 1.4em;
        padding-bottom:20px;
    }
    .blog-wrapper .content {
        font-family: 'kanit';
        font-size: 1.2em;
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
</style>