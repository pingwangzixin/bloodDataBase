<template>
<div>
  <div class='navBar'>
    <!-- <el-row class="navTitle">
      <el-col :span="24"></el-col>
    </el-row> -->
    <el-row class="tac">
  <el-col :span="24">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      router>

      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>患者管理</span>
        </template>
        <el-menu-item-group>
          <!-- <el-menu-item index="/index">患者管理</el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-col>
</el-row>
  </div>
  <div class="header">
    <div class="tilebav">山西省血液病数据平台</div>
    <div class="logout" @click="logout">退出登陆</div>
  </div>
  <router-view></router-view>
  </div>
</template>
<script>
import { removeToken } from "@/utils/token";
export default {
  name: "navBar",
  data() {
    return {
      routeNav: {
        index: "/index",
        login: "/login"
      },
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    /**
     * 退出登陆
     */
    logout: function() {
      removeToken();
      this.$router.push({
        path: "/login"
      });
    }
  }
};
</script>
<style>


</style>
