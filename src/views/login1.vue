<template>
	<div class="loginbg">
		<el-form ref="form" label-width="70px" class="loginForm">
			<el-tabs type="border-card" v-model="activeTest" @tab-click="handleClick">
				<el-tab-pane label="用户登录" name="first">
					<el-form ref="form" :model="form" :rules="rules">
						<el-form-item class="labelel" label="账号" prop="username">
							<el-input class="inputel" v-model="form.username" placeholder="请输入登录名"></el-input>
						</el-form-item>
						<el-form-item class="labelel" label="密码" prop="password">
							<el-input class="inputel" type="password" v-model="form.password" placeholder="请输入密码"></el-input>
						</el-form-item>
						<el-form-item class="buttonlogin">
							<el-button type="primary" @click="onSubmit('form')">登陆</el-button>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="用户注册" name="second">
					<el-form ref="form" :model="formadd" :rules="rulesadd">
						<el-form-item class="labelel" label="账号" prop="username">
							<el-input class="inputel" v-model="formadd.username" placeholder="请输入登录名"></el-input>
						</el-form-item>
						<el-form-item class="labelel" label="密码" prop="password">
							<el-input class="inputel" type="password" v-model="formadd.password" placeholder="请输入密码"></el-input>
						</el-form-item>
						<el-form-item class="labelel" label="昵称" prop="name">
							<el-input class="inputel" v-model="formadd.name" placeholder="请输入昵称"></el-input>
						</el-form-item>
						<el-form-item class="buttonlogin">
							<el-button type="success" @click="onSubaddmit('formadd')" plain>注册</el-button>
						</el-form-item>
					</el-form>
				</el-tab-pane>
			</el-tabs>
		</el-form>
	</div>
</template>

<script>
	// import { login } from '@/api/login'
	import qs from "qs"
	import axios from '@/router/axios'
	import router from '@/router/index'
	import {
		baseUrl
	} from '@/utils/baseUrl'

	export default {
		data() {
			return {
				form: {
					username: '',
					password: ""
				},
				formadd: {
					username: '',
					password: "",
					name: ""
				},
				activeTest: 'first',
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
					},

				},
				rulesadd: {
					username: {
						required: true,
						message: '请输入登录名',
						trigger: 'blur'
					},
					password: {
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					},
					name: {
						required: true,
						message: '请输入昵称',
						trigger: 'blur'
					}
				}
			}
		},
		methods: {
			handleClick(tab, event) {
				console.log(tab, event);
			},
			/**
			 * 登陆
			 */
			onSubmit(formName) {
				axios.post(baseUrl() + 'user/loginUser', this.form)
					.then((response) => {
						if (response.data.code == 200) {
							var username = response.data.data.username
							sessionStorage.setItem("userName", username)
							router.push({
								path: '/index'
							});
						} else {
							this.$message({
								message: response.data.message,
								type: 'warning'
							});
						}
					})
					.catch((error) => {
						this.$message.error('登陆失败');
					})
			},
			// 注册
			onSubaddmit(formName) {
				axios.post(baseUrl() + 'user/saveEmylee', this.form)
					.then((response) => {
						if (response.data.message == "保存成功") {
							this.$message({
								message: '注册成功,请登录',
								type: 'warning'
							});
							this.activeTest = 'first'
						} else {
							this.$message({
								message: response.data.message,
								type: 'warning'
							});
						}
					})
					.catch((error) => {
						this.$message.error('登陆失败');
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
		opacity: 0.8;
	}

	.loginbg .el-input {
		width: 310px !important
	}
</style>
