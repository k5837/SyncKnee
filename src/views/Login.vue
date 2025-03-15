<template>
    <div class="login-container">
      <div>
      </div>
      <el-form :model="loginForm" :rules="rules2" status-icon ref="loginForm" label-position="left" label-width="0px"
        class="demo-ruleForm login-page">
        <h3 class="title" style="color: #fff; text-align: center;">Sign in</h3>
        <br />
        <el-form-item prop="username">
          <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="user name"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="password"></el-input>
        </el-form-item> -->
  
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%; background-color: rgba(111, 32, 120, 0.49); border: none;"
            @click="handleSubmit" :loading="logining">Sign in</el-button>
        </el-form-item>
        <div>
          还没有账户？ <RouterLink to="Register"> 立即注册！</RouterLink>
        </div>
      </el-form>
    </div>
  </template>
    
  
  <script>
  
  // import  {getTransitionRawChildren } from '@vue/runtime-core';
  import axios from 'axios'
  
  export default {
    data() {
      return {
        logining: false,
        loginForm: {
          username: '',
          password: '',
        },
        rules2: {
          username: [{ required: true, message: 'Please enter the account number', trigger: 'blur' }],
          // password: [{ required: true, message: 'Please input a password', trigger: 'blur' }]
        },
        checked: false
      }
    },
    methods: {
  //     handleSubmit(event) {   //只有username 没有密码验证      
  //       this.$refs.loginForm.validate(valid => {
  //         if (valid) {
  //           this.$axios.get('https://mbogg2.deta.dev/api/v1/auth', { //后端接口https://v614backend-1-x1986037.deta.app/api/v1/records/
  //              key: this.loginForm.username,
  //           })
  //             .then((response) => {
  //               if (response.status === 200) {
  //                 this.$store.commit('GET_USERNAME', response.data.name)
  //                 console.log('姓名为',window.sessionStorage.getItem('username'))
  
  //                 this.$message({
  //                   message: '登陆成功',
  //                   type: 'success'
  //                 })
  //                 this.$router.push({ path:'/Home'})
  //               }
  //             })
  //             .catch(function (error) {
  //               console.log(error)
  //             })
  //         } else {
  //           console.log('error submit!!')
  //           return false
  //         }
  //       })
  //     },
  //   },
  // }
  
      // handleSubmit(event){
      //         this.$refs.loginForm.validate((valid) => {
      //             if(valid){
      //                 this.logining = true;
      //                 if(this.loginForm.username === 'admin' && 
      //                    this.loginForm.password === '123456'){
      //                        this.logining = false;
      //                        localStorage.setItem('username', this.loginForm.username);
      //                        console.log('姓名为',localStorage.getItem('username'))
      //                        this.$router.push({path: '/Main'});
      //                 }else{
      //                     this.logining = false;
      //                     this.$alert('Wrong user name or password!', 'Tips', {
      //                         confirmButtonText: 'ok'
      //                     })
      //                 }
      //             }else{
      //                 console.log('error submit!');
      //                 return false;
      //             }
      //         })
      //     }
  
      handleSubmit(event) {   //只有username 没有密码验证 
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.$axios.post('https://v614backend-1-x1986037.deta.app/api/v1/auth', { //后端接口/api/v1/auth https://v614backend-1-x1986037.deta.app/api/v1/auth
              key: this.loginForm.username, //name/key
            })
              .then((response) => {
                if (response.status === 200) {
  
                  console.log('登录数据',response.data.user.name)
  
                  this.$store.commit('GET_USERNAME', response.data.user.name)
  
                  
                  
                  console.log('姓名为', window.sessionStorage.getItem('username'))
  
                  this.$message({
                    message: '登录成功',
                    type: 'success'
                  })
                  this.$router.push({ path: '/home' })
                }
              })
              .catch((error) =>{
                console.log(error)
                this.$message({
                    message: '登录失败',
                    type: 'error'
                  })
                
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
    }
  }
  
  
  
  </script>
    
  <style scoped>
  .login-container {
    background: url("../assets/bg0.jpeg") no-repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
    /* 登录框上下对齐 */
    display: flex;
    align-items: center;
  }
  
  .login-page {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    margin: 0px auto;
    width: 350px;
    padding: 35px 35px 35px 35px;
    background: rgba(255, 255, 255, 0.279);
  
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.224);
  }
  
  label.el-checkbox.rememberme {
    margin: 0px 0px 15px;
    text-align: left;
  }
  </style>