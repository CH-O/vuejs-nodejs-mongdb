<template>
  <div class="content-box">
    <div class="center">
      <aside class="page-side">
        <nav class="page-side-box">
          <ul class="nav nav-stacked nav-pills">
            <li role="presentation" :class="{active : pageActive == 'Edit'}" @click="pageActive = 'Edit'">
              <router-link to="/admin/edit">Edit</router-link>
            </li>
            <li role="presentation" :class="{active : pageActive == 'New'}" @click="pageActive = 'New'">
              <router-link to="/admin/new">New</router-link>
            </li>
            <li role="presentation" :class="{active : pageActive == 'User'}" @click="pageActive = 'User'">
              <router-link to="/admin/user">User</router-link>
            </li>
          </ul>
        </nav>
      </aside>
      <section class="page-subject">
        <router-view></router-view> 
      </section>
    </div>
  </div>
</template>

<script>

export default {
  name: 'hello',
  data (){
    return {
      pageActive: ''
    }
  }
  
 
}

</script>

<style scoped>

</style>