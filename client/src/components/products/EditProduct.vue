<template>
  <div class="container product-wrapper">
    <main-header navsel="back"></main-header>
    <h1>Edit Ipad</h1>
    <form v-on:submit.prevent = "editProduct" >
      <!-- <p>title: <input type="text" v-model="product.title"></p> -->
      <p>
        <label for="" class="control-label">Series: </label>
        <input type="text" v-model="product.title" class="form-control">        
      </p>
      <transition name="fade">
        <div class="thumbnail-pic" v-if="product.thumbnail != 'null'">
          <img class="img-thumbnail" :src="BASE_URL+product.thumbnail" alt="thumbnail">
        </div>
      </transition>  
      <form id="upload-form" enctype="multipart/form-data" novalidate>
        <div class="dropbox">
          <input type="file" multiple :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
            accept="image/*" class="input-file">
            <!-- <p v-if="isInitial || isSuccess"> -->
            <p v-if="isInitial">
              Drag your file(s) here to begin<br> or click to browse
            </p>
            <p v-if="isSaving">
              Uploading {{ fileCount }} files...
            </p>   
            <p v-if="isSuccess">
              Upload Successful.
            </p>        
        </div>
      </form>
      <div>
      <transition-group tag="ul" name="fade" class="pictures">        
        <li v-for="picture in pictures" v-bind:key="picture.id">              
          <img class="img-thumbnail" style="margin-bottom:5px;" :src="BASE_URL+picture.name" alt="picture image">              
          <br />  
          <button class="btn btn-xs btn-info" v-on:click.prevent="useThumbnail(picture.name)">Thumbnail</button>
          <button class="btn btn-xs btn-danger" v-on:click.prevent="delFile(picture)">Delete</button>
        </li>        
      </transition-group>
      <div class="clearfix"></div>
      </div>  
      <p><strong>Detail: </strong></p>
      <p><vue-ckeditor v-model.lazy="product.content" :config="config" @blur="onBlur($event)" @focus="onFocus($event)" /></p>            
      <p>
        <label class="control-label">Brand :</label>
        <input type="text" v-model="product.category" class="form-control">
      </p>     
      <p>
        <label class="control-label">Status:</label>
        <input type="text" v-model="product.prices" class="form-control">
      </p>       
      <p>
        <button class="btn btn-warning" type="submit">Update Notebook</button>
        <button class="btn btn-default" type="button" v-on:click="navigateTo('/products')">Back</button>
      </p>      
      
    </form>   
    <br>    
  </div>
</template>
<script>
import ProductsService from '@/services/ProductsService'
import UploadService from '@/services/UploadService'
import VueCkeditor from "vue-ckeditor2"
import {mapState} from 'vuex'

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3

export default {
  data () {
    return {
      // product data
      product: {
        title: '',
        thumbnail: 'null',
        pictures: 'null',
        content: '',
        category: '',
        status: '',
        prices: ''
      },

      // ckeditor
      config: {
        toolbar: [
          ["Bold", "Italic", "Underline", "Strike", "Subscript", "Superscript"]
        ],
        height: 300
      },

      // upload data
      BASE_URL: "http://localhost:8081/assets/uploads/",
      error: null,      
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "userPhoto",      
      uploadedFileNames:[],
      pictureIndex: 0,

      // show result
      pictures: [],
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    // ckedior ()
    onBlur(editor) {
      console.log(editor);
    },
    onFocus(editor) {
      console.log(editor);
    },
    
    // product
    async editProduct () {
      this.product.pictures = JSON.stringify(this.pictures)
      try {
        await ProductsService.put(this.product)
        this.$router.push({
          name: 'products'
        })
      } catch (err) {
        console.log(err)
      }
    },

    // manage pic field
    useThumbnail (filename) {     
      console.log(filename) 
      this.product.thumbnail = filename
    },
    async delFile (material){
      let dataJSON = {
        "filename":material.name
      }
      
      await UploadService.delete(dataJSON)      

      for (var i=0;i<this.pictures.length;i++){
        if(this.pictures[i].id === material.id) {
          this.pictures.splice(i, 1)
          this.materialIndex--
          break
        }
      }     
    },

    // upload
    wait(ms) {
      return x => {
        return new Promise(resolve => setTimeout(() => resolve(x), ms));
      };
    },    
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL
      // this.uploadedFiles = []
      this.uploadError = null   
      this.uploadedFileNames = []
    },
    async save(formData) {
      // upload data to the server
      try {
        this.currentStatus = STATUS_SAVING
        await UploadService.upload(formData)
        this.currentStatus = STATUS_SUCCESS

        // update image uploaded display
        let pictureJSON = []
        this.uploadedFileNames.forEach(uploadFilename => {
          let found = false;
          for(let i=0;i<this.pictures.length;i++){
            if(this.pictures[i].name == uploadFilename){            
              found = true            
              break
            }            
          }

          if(!found){
            this.pictureIndex++
            let pictureJSON = {
              id: this.pictureIndex,
              name: uploadFilename
            }
            this.pictures.push(pictureJSON) 
          }  
        })


        this.clearUploadResult()
      } catch (error) {
        console.log(error)
        this.currentStatus = STATUS_FAILED
      }
    },
    filesChange(fieldName, fileList) {
      // handle file changes
      const formData = new FormData();

      if (!fileList.length) return;

      // append the files to FormData
      Array.from(Array(fileList.length).keys()).map(x => {
        formData.append(fieldName, fileList[x], fileList[x].name);
        this.uploadedFileNames.push(fileList[x].name);
      });

      // save it
      this.save(formData)

      // clear form
      document.getElementById("upload-form").reset()
    },
    clearUploadResult: function(){            
      setTimeout(() => this.reset(), 5000);
    }
  },

  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ]),
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
    }
  },

  async mounted () {
    if (!this.isUserLoggedIn) {
      this.$router.push({
        name: 'login'        
      })
    }

    try {      
      let productId = this.$route.params.productId
      this.product = (await ProductsService.show(productId)).data 
      this.pictures = JSON.parse(this.product.pictures)
    } catch (error) {
      console.log (error)
    }
  },
  
  created () {    

    this.reset()

    this.config.toolbar = [
      {
        name: "document",
        items: [
          "Source",
          "-",
          "Save",
          "NewPage",
          "Preview",
          "Print",
          "-",
          "Templates"
        ]
      },
      {
        name: "clipboard",
        items: [
          "Cut",
          "Copy",
          "Paste",
          "PasteText",
          "PasteFromWord",
          "-",
          "Undo",
          "Redo"
        ]
      },
      {
        name: "editing",
        items: ["Find", "Replace", "-", "SelectAll", "-", "Scayt"]
      },
      {
        name: "forms",
        items: [
          "Form",
          "Checkbox",
          "Radio",
          "TextField",
          "Textarea",
          "Select",
          "Button",
          "ImageButton",
          "HiddenField"
        ]
      },
      "/",
      {
        name: "basicstyles",
        items: [
          "Bold",
          "Italic",
          "Underline",
          "Strike",
          "Subscript",
          "Superscript",
          "-",
          "CopyFormatting",
          "RemoveFormat"
        ]
      },
      {
        name: "paragraph",
        items: [
          "NumberedList",
          "BulletedList",
          "-",
          "Outdent",
          "Indent",
          "-",
          "Blockquote",
          "CreateDiv",
          "-",
          "JustifyLeft",
          "JustifyCenter",
          "JustifyRight",
          "JustifyBlock",
          "-",
          "BidiLtr",
          "BidiRtl",
          "Language"
        ]
      },
      { name: "links", items: ["Link", "Unlink", "Anchor"] },
      {
        name: "insert",
        items: [
          "Image",
          "Flash",
          "Table",
          "HorizontalRule",
          "Smiley",
          "SpecialChar",
          "PageBreak",
          "Iframe",
          "InsertPre"
        ]
      },
      "/",
      { name: "styles", items: ["Styles", "Format", "Font", "FontSize"] },
      { name: "colors", items: ["TextColor", "BGColor"] },
      { name: "tools", items: ["Maximize", "ShowBlocks"] },
      { name: "about", items: ["About"] }
    ] 
  },
  components: { 
    VueCkeditor 
  },
}
</script>
<style scoped>
.product-wrapper {
  margin-top:80px;
}

/* thumbnail */
.thumbnail-pic img{
  width:200px;
  margin-bottom: 10px;
}
/* display uploaded pic */
ul.pictures {
  list-style: none;
  padding: 0;
  margin: 0;
  float: left;
  padding-top: 10px;
  padding-bottom: 10px;
}

ul.pictures li {
  float: left;
}

ul.pictures li img {
  max-width: 180px;
  margin-right: 20px;
}

/* uplaod */
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background:lemonchiffon;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background:khaki; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>