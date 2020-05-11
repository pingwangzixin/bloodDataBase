<template>
  <div class="loginbg">
    <el-form ref="form" :model="form" :rules="rules" label-width="60px" class="loginForm">
      <el-row>
        <el-col :span="24" class="loginTitle">系统登陆</el-col>
      </el-row>
      <el-form-item class="labelel" label="账号" prop="username">
        <el-input class="inputel"  v-model="form.username" placeholder="登录名"></el-input>
      </el-form-item>
      <el-form-item class="labelel"  label="密码" prop="password">
        <el-input class="inputel" type="password" v-model="form.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item class="buttonlogin">
        <el-button type="primary" @click="onSubmit('form')">账号登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { login } from '@/api/login'
import qs from "qs"
import axios from '@/router/axios'
import router from '@/router/index'
import { baseUrl } from '@/utils/baseUrl'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      code: '',
      submitPhone: '',
      resCode: '',
      codeText: '获取验证码',
      disabled: false,
      codeBtn: {
        codeBtn: true,
        opc: false
      },
      rules: {
        username: {
          required: true,
          message: '请输入登录名',
          trigger: 'blur'
        },
        password: {
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }
      }
    }
  },
  methods: {
    /**
     * 登陆
     */
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post(baseUrl()+'user/loginUser',this.form)
          .then( (response) => {
            if (response.data.code == 200) {

              var username = response.data.data.username
              console.log("username")
              sessionStorage.setItem("userName",username)
              router.push({ path: '/index' });


            } else {
              this.$message({
                message: response.data.message,
                type: 'warning'
              });
            }
          })
          .catch( (error) => {
            this.$message.error('登陆失败');
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.codeInput {
  width: 55%;
  margin-right: 5%;
}
.codeBtn {
  width: 40%;
}

.codeBtn.opc {
  opacity:0.8;
}

.loginForm {
	width: auto;
	height: auto;
	position: absolute;
	left: 50%;
	top: 50%;
	margin-left: -250px;
	margin-top: -220px;
	background: rgba(0, 0, 0, .5);
	padding: 50px 60px;
	box-sizing: border-box;
}

.loginbg .el-input {
		width: 320px !important
	}
</style>